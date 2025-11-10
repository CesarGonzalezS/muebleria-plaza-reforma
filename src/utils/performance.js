// Utilidades para optimización de imágenes
export const imageOptimizer = {
  // Generar srcset para imágenes responsivas
  generateSrcSet(baseUrl, sizes = [320, 640, 960, 1280, 1920]) {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  },

  // Generar sizes attribute
  generateSizes(breakpoints = {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw'
  }) {
    return [
      `(max-width: 768px) ${breakpoints.mobile}`,
      `(max-width: 1024px) ${breakpoints.tablet}`,
      breakpoints.desktop
    ].join(', ');
  },

  // Lazy load con Intersection Observer
  lazyLoadImages(selector = 'img[data-src]') {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      document.querySelectorAll(selector).forEach(img => {
        imageObserver.observe(img);
      });

      return imageObserver;
    }
  },

  // Convertir imagen a WebP si el navegador lo soporta
  supportsWebP() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  },

  // Obtener formato de imagen óptimo
  getOptimalFormat(originalUrl) {
    if (this.supportsWebP()) {
      return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return originalUrl;
  }
};

// Debounce para optimizar eventos
export function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle para scroll events
export function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Preload de recursos críticos
export function preloadResource(url, as = 'image') {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = as;
  link.href = url;
  document.head.appendChild(link);
}

// Prefetch para navegación anticipada
export function prefetchResource(url) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

export default {
  imageOptimizer,
  debounce,
  throttle,
  preloadResource,
  prefetchResource
};

