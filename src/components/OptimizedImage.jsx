// src/components/OptimizedImage.jsx
import { useState, useCallback } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width,
  height,
  lazy = true,
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = useCallback(() => setLoaded(true), []);
  const handleError = useCallback(() => setError(true), []);

  return (
    <div className={`image-container ${className}`} style={{ position: 'relative' }}>
      {/* Loading skeleton */}
      {!loaded && !error && (
        <div 
          className="skeleton"
          style={{ 
            width: width || '100%', 
            height: height || '200px',
            position: loaded ? 'absolute' : 'static',
            top: 0,
            left: 0,
            borderRadius: '8px'
          }} 
        />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? "lazy" : "eager"}
        decoding="async"
        style={{ 
          display: loaded ? 'block' : 'none',
          width: '100%',
          height: 'auto',
          borderRadius: '8px'
        }}
        {...props}
      />
      
      {/* Error fallback */}
      {error && (
        <div 
          style={{
            width: width || '100%',
            height: height || '200px',
            background: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px dashed #dee2e6'
          }}
        >
          Resim yüklenemedi
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;