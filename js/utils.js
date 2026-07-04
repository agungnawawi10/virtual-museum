/**
 * Utility functions for DOM manipulation and common operations
 */

class DOMUtils {
  /**
   * Safe query selector
   * @param {string} selector - CSS selector
   * @returns {Element|null} Element or null if not found
   */
  static querySelector(selector) {
    try {
      const el = document.querySelector(selector);
      if (!el) {
        console.warn(`[DOMUtils] Element not found: ${selector}`);
      }
      return el;
    } catch (e) {
      console.error(`[DOMUtils] Invalid selector: ${selector}`, e);
      return null;
    }
  }

  /**
   * Safe get element by ID
   * @param {string} id - Element ID
   * @returns {Element|null} Element or null if not found
   */
  static getElementById(id) {
    try {
      const el = document.getElementById(id);
      if (!el) {
        console.warn(`[DOMUtils] Element not found: #${id}`);
      }
      return el;
    } catch (e) {
      console.error(`[DOMUtils] Error getting element: #${id}`, e);
      return null;
    }
  }

  /**
   * Safe query selector all
   * @param {string} selector - CSS selector
   * @returns {NodeList} NodeList of elements
   */
  static querySelectorAll(selector) {
    try {
      return document.querySelectorAll(selector);
    } catch (e) {
      console.error(`[DOMUtils] Invalid selector: ${selector}`, e);
      return [];
    }
  }

  /**
   * Add event listener with automatic cleanup
   * @param {Element} element - Target element
   * @param {string} event - Event name
   * @param {function} handler - Event handler
   * @param {object} options - Event listener options
   * @returns {function} Function to remove listener
   */
  static addEventListener(element, event, handler, options = {}) {
    if (!element) {
      console.warn('[DOMUtils] Cannot add listener - element is null');
      return () => {};
    }

    element.addEventListener(event, handler, options);

    // Return cleanup function
    return () => {
      element.removeEventListener(event, handler, options);
    };
  }

  /**
   * Set multiple attributes at once
   * @param {Element} element - Target element
   * @param {object} attributes - Key-value pairs of attributes
   */
  static setAttributes(element, attributes) {
    if (!element) return;
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    });
  }

  /**
   * Safely toggle class
   * @param {Element} element - Target element
   * @param {string} className - Class name
   * @param {boolean} force - Optional force add/remove
   */
  static toggleClass(element, className, force) {
    if (!element) return;
    element.classList.toggle(className, force);
  }

  /**
   * Create element with optional content and attributes
   * @param {string} tag - HTML tag name
   * @param {object} options - Options object
   * @returns {Element} Created element
   */
  static createElement(tag, options = {}) {
    const element = document.createElement(tag);

    if (options.id) element.id = options.id;
    if (options.className) element.className = options.className;
    if (options.textContent) element.textContent = options.textContent;
    if (options.innerHTML) element.innerHTML = options.innerHTML;

    if (options.attributes) {
      this.setAttributes(element, options.attributes);
    }

    if (options.children && Array.isArray(options.children)) {
      options.children.forEach(child => {
        if (child) element.appendChild(child);
      });
    }

    return element;
  }
}

/**
 * Utility functions for geometry and math operations
 */
class GeometryUtils {
  /**
   * Clamp value between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  static clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * Distance between two 3D points
   * @param {object} p1 - Point 1 {x, y, z}
   * @param {object} p2 - Point 2 {x, y, z}
   * @returns {number} Distance
   */
  static distance3D(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Distance between two 2D points
   * @param {object} p1 - Point 1 {x, y}
   * @param {object} p2 - Point 2 {x, y}
   * @returns {number} Distance
   */
  static distance2D(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Linear interpolation
   * @param {number} a - Start value
   * @param {number} b - End value
   * @param {number} t - Time (0-1)
   * @returns {number} Interpolated value
   */
  static lerp(a, b, t) {
    return a + (b - a) * this.clamp(t, 0, 1);
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Degrees
   * @returns {number} Radians
   */
  static degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Convert radians to degrees
   * @param {number} radians - Radians
   * @returns {number} Degrees
   */
  static radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
  }
}

/**
 * Utility functions for common operations
 */
class CommonUtils {
  /**
   * Debounce function calls
   * @param {function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {function} Debounced function
   */
  static debounce(fn, delay = 300) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Throttle function calls
   * @param {function} fn - Function to throttle
   * @param {number} interval - Interval in milliseconds
   * @returns {function} Throttled function
   */
  static throttle(fn, interval = 300) {
    let lastTime = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  }

  /**
   * Safe JSON parse
   * @param {string} jsonString - JSON string
   * @param {*} defaultValue - Default value if parse fails
   * @returns {*} Parsed object or default value
   */
  static safeJsonParse(jsonString, defaultValue = null) {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn('[CommonUtils] JSON parse error:', e);
      return defaultValue;
    }
  }

  /**
   * Safely validate collection ID
   * @param {string} id - ID to validate
   * @returns {string|null} Valid ID or null
   */
  static sanitizeCollectionId(id) {
    if (typeof id !== 'string') return null;
    // Only allow alphanumeric and hyphens
    return id.match(/^[a-zA-Z0-9\-]+$/) ? id : null;
  }

  /**
   * Get query parameters from URL
   * @param {string} key - Parameter key (optional)
   * @returns {object|string|null} All params, specific param, or null
   */
  static getQueryParams(key = null) {
    const params = new URLSearchParams(window.location.search);
    
    if (key) {
      return params.get(key);
    }
    
    const allParams = {};
    params.forEach((value, key) => {
      allParams[key] = value;
    });
    return allParams;
  }

  /**
   * Check browser capabilities
   * @returns {object} Browser capability flags
   */
  static getCapabilities() {
    return {
      webGL: !!window.WebGLRenderingContext,
      webAudio: !!(window.AudioContext || window.webkitAudioContext),
      serviceWorker: 'serviceWorker' in navigator,
      localStorage: (() => {
        try {
          const test = '__test__';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch (e) {
          return false;
        }
      })(),
      geolocation: 'geolocation' in navigator,
      camera: (() => {
        return !!(
          navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia
        );
      })(),
      touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      pointerLock: 'pointerLockElement' in document
    };
  }

  /**
   * Format timestamp to readable string
   * @param {Date|number} timestamp - Timestamp
   * @returns {string} Formatted timestamp
   */
  static formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

export { DOMUtils, GeometryUtils, CommonUtils };
