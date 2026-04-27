/**
 * AI Image Analysis for Disaster Type Detection
 * Uses canvas-based color distribution analysis to classify disaster types
 * Much more accurate than random selection
 */

const DISASTER_PROFILES = {
  Fire: {
    keys: ['red', 'orange', 'yellow', 'dark'],
    weights: [50, 40, 15, 10],
    severity: 'critical',
  },
  Flood: {
    // Floods often have muddy brown water and bright orange rescue boats/jackets
    keys: ['blue', 'brown', 'mud', 'orange', 'cyan'],
    weights: [45, 40, 25, 15, 10],
    severity: 'high',
  },
  Earthquake: {
    keys: ['gray', 'dust', 'dark', 'brown'],
    weights: [35, 25, 15, 10],
    severity: 'critical',
  },
  Landslide: {
    keys: ['brown', 'mud', 'green', 'dark'],
    weights: [45, 30, 15, 10],
    severity: 'high',
  },
  'Building Collapse': {
    // Removed brown to prevent muddy floods from triggering this
    keys: ['gray', 'dust', 'dark', 'metal'],
    weights: [45, 30, 20, 15],
    severity: 'critical',
  },
  Cyclone: {
    keys: ['gray', 'blue', 'dark', 'white'],
    weights: [25, 20, 15, 10],
    severity: 'high',
  },
  Accident: {
    keys: ['metal', 'red', 'gray', 'dark'],
    weights: [30, 25, 20, 10],
    severity: 'high',
  },
  Medical: {
    keys: ['red', 'white', 'bright'],
    weights: [25, 20, 15],
    severity: 'high',
  },
}

// Map MobileNet object categories to our disaster types
const ML_KEYWORDS = {
  'Fire': ['fire', 'flame', 'match', 'lighter', 'torch', 'volcano', 'stove', 'engine'],
  'Flood': ['boat', 'canoe', 'speedboat', 'raft', 'water', 'fountain', 'dam', 'breakwater', 'lake', 'river', 'submarine', 'paddle', 'lifeboat', 'catamaran'],
  'Earthquake': ['rubble', 'ruin', 'trench', 'crater', 'debris', 'destruction', 'shattered'],
  'Landslide': ['earth', 'mud', 'cliff', 'alp', 'mountain', 'valley', 'rocks', 'dirt'],
  'Building Collapse': ['crane', 'tractor', 'plow', 'construction', 'prison', 'lumber', 'wreck', 'beam', 'concrete'],
  'Accident': ['car', 'cab', 'ambulance', 'truck', 'van', 'bus', 'traffic', 'street', 'wheel', 'tire', 'racer', 'sports car', 'minivan', 'crash', 'collision'],
  'Medical': ['ambulance', 'stretcher', 'syringe', 'hospital', 'band aid', 'pill', 'gown', 'doctor', 'nurse', 'emergency room']
}

let mobilenetModel = null;

async function loadMobileNet() {
  if (mobilenetModel) return mobilenetModel;
  
  try {
    if (!window.tf) {
      const tfScript = document.createElement('script');
      tfScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js';
      document.head.appendChild(tfScript);
      await new Promise((resolve) => tfScript.onload = resolve);
    }
    
    if (!window.mobilenet) {
      const mnScript = document.createElement('script');
      mnScript.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0/dist/mobilenet.min.js';
      document.head.appendChild(mnScript);
      await new Promise((resolve) => mnScript.onload = resolve);
    }

    mobilenetModel = await window.mobilenet.load();
    return mobilenetModel;
  } catch (err) {
    console.warn("Failed to load MobileNet, falling back to pure color heuristics:", err);
    return null;
  }
}

function extractColorFeatures(imageDataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const size = 150
      canvas.width = size
      canvas.height = size
      ctx.drawImage(img, 0, 0, size, size)

      const imageData = ctx.getImageData(0, 0, size, size)
      const data = imageData.data
      const pixelCount = data.length / 4

      let totalR = 0, totalG = 0, totalB = 0
      let redPx = 0, orangePx = 0, yellowPx = 0
      let bluePx = 0, cyanPx = 0, greenPx = 0, brownPx = 0
      let grayPx = 0, darkPx = 0, brightPx = 0, whitePx = 0

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2]
        totalR += r; totalG += g; totalB += b

        const brightness = (r + g + b) / 3
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const sat = max === 0 ? 0 : (max - min) / max

        let hue = 0
        if (max !== min) {
          if (max === r) hue = 60 * ((g - b) / (max - min))
          else if (max === g) hue = 60 * (2 + (b - r) / (max - min))
          else hue = 60 * (4 + (r - g) / (max - min))
          if (hue < 0) hue += 360
        }

        if (brightness < 50) darkPx++
        if (brightness > 210) brightPx++
        if (brightness > 230 && sat < 0.1) whitePx++

        if (sat > 0.25) {
          if ((hue < 20 || hue > 340) && r > 100) redPx++
          // Lowered r threshold to catch darker orange rafts in muddy water
          if (hue >= 20 && hue < 45 && r > 120) orangePx++
          if (hue >= 45 && hue < 75) yellowPx++
          if (hue >= 75 && hue < 160 && g > 60) greenPx++
          if (hue >= 160 && hue < 200) cyanPx++
          if (hue >= 200 && hue < 260 && b > 80) bluePx++
          // Brown: low sat orange/yellow, but can also be muddy water (which is often dark yellow)
          if (hue >= 15 && hue < 60 && sat < 0.7 && brightness < 160) brownPx++
        }
        if (sat < 0.20 && brightness > 50 && brightness < 200) grayPx++
      }

      const n = pixelCount
      resolve({
        red: redPx / n, orange: orangePx / n, yellow: yellowPx / n,
        blue: bluePx / n, cyan: cyanPx / n, green: greenPx / n, brown: brownPx / n,
        gray: grayPx / n, dark: darkPx / n, bright: brightPx / n,
        white: whitePx / n,
        warmth: (totalR / n - totalB / n) / 255,
        dust: (grayPx / n > 0.3 && brownPx / n < 0.1) ? 1 : 0, // Dust should not be too brown
        mud: brownPx / n > 0.10 ? 1 : 0, // Lowered threshold for mud
        metal: (grayPx / n > 0.2 && brightPx / n > 0.1) ? 1 : 0,
      })
    }
    img.onerror = () => reject(new Error('Failed to load image for analysis'))
    img.src = imageDataUrl
  })
}

export async function analyzeDisasterImage(imageDataUrl) {
  try {
    const [colors, model] = await Promise.all([
      extractColorFeatures(imageDataUrl),
      loadMobileNet()
    ]);

    const scores = {}
    for (const [type, profile] of Object.entries(DISASTER_PROFILES)) {
      let score = 0
      profile.keys.forEach((key, i) => {
        score += (colors[key] || 0) * profile.weights[i]
      })
      scores[type] = score
    }

    // Run actual ML object detection if model loaded
    if (model) {
      const imgElement = new Image();
      imgElement.src = imageDataUrl;
      await new Promise(r => imgElement.onload = r);
      
      const predictions = await model.classify(imgElement);
      console.log("ML Predictions:", predictions);
      
      predictions.forEach(p => {
        const className = p.className.toLowerCase();
        for (const [type, keywords] of Object.entries(ML_KEYWORDS)) {
          if (keywords.some(kw => className.includes(kw))) {
            // Massive boost if an object matches the disaster type
            scores[type] = (scores[type] || 0) + (p.probability * 500);
          }
        }
      });
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    const topType = sorted[0][0]
    const topScore = sorted[0][1]
    const secondScore = sorted[1]?.[1] || 0

    let confidence
    if (topScore === 0) {
      confidence = 50
    } else {
      const dominance = topScore / (topScore + secondScore)
      confidence = Math.min(96, Math.max(55, Math.round(dominance * 100 + 15)))
    }

    const profile = DISASTER_PROFILES[topType]
    const intensity = colors.red + colors.orange + colors.dark
    let severity = profile.severity
    if (intensity > 0.5) severity = 'critical'
    else if (intensity > 0.3) severity = 'high'
    else if (intensity > 0.15) severity = 'medium'
    else if (intensity < 0.08) severity = 'low'

    return {
      type: topType,
      severity,
      confidence,
      alternatives: sorted.slice(1, 3).map(([t]) => t),
    }
  } catch (err) {
    console.error('Image analysis failed:', err)
    return { type: 'Unknown', severity: 'medium', confidence: 50, alternatives: [] }
  }
}
