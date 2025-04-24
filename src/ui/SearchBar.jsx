/* eslint-disable react/prop-types */

import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { searchBlogs } from '../services/apiBlogs';
import { FiX, FiClock, FiTag } from 'react-icons/fi';

// Animasyon tanımları
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Ana container
const SearchContainer = styled.div`
  position: relative;
  max-width: 650px;
  margin: 50px auto 0;
  width: 100%;
  z-index: 100;

  @media (max-width: 910px) {
    margin-top: 100px; 
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    
  }
  @media (max-width: 550px) {
    margin-top: 60px;
  } 
`;

// Input wrapper için geliştirilmiş stil
const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 40px;
  background-color: var(--color-grey-0, #fff);
  border: 1px solid var(--color-grey-200, #e5e7eb);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:focus-within {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--color-grey-400, #9ca3af);
    transform: translateY(-2px);
  }
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Geliştirilmiş input alanı
const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: none;
  background: transparent;
  border-radius: 40px;
  font-size: 16px;
  color: var(--color-grey-800, #1f2937);
  outline: none;
  font-weight: 400;
  letter-spacing: 0.2px;
  
  &::placeholder {
    color: var(--color-grey-400, #9ca3af);
    transition: color 0.2s ease;
  }
  
  &:focus::placeholder {
    color: var(--color-grey-500, #6b7280);
  }

  @media (max-width: 550px) {
    padding: 14px 15px;
    font-size: 15px;
  }
`;

// Custom SVG Search Icon
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-grey-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Arama butonu
const SearchButton = styled.button`
  background: var(--color-grey-900, #111827);
  color: white;
  border: none;
  height: 46px;
  width: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    background: var(--color-grey-800, #1f2937);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 550px) {
    height: 40px;
    width: 40px;
  }
`;

// Temizleme butonu
const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: var(--color-grey-500, #6b7280);
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  
  &:hover {
    color: var(--color-grey-700, #374151);
    transform: translateY(-50%) scale(1.1);
  }
  
  &:active {
    transform: translateY(-50%) scale(0.9);
  }

  @media (max-width: 550px) {
    right: 50px;
  }
`;

// Sonuçlar container'ı
const ResultsContainer = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  left: 0;
  right: 0;
  background-color: var(--color-grey-912);
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  max-height: 450px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => (props.show ? 'block' : 'none')};
  animation: ${fadeIn} 0.3s ease;
  border: 1px solid var(--color-grey-100, #f3f4f6);
  
  /* Kaydırma çubuğu stili */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--color-grey-50, #f9fafb);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--color-grey-300, #d1d5db);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--color-grey-400, #9ca3af);
  }
  
  @media (max-width: 550px) {
    max-height: 350px;
    border-radius: 12px;
  }
`;

// Sonuç öğesi
const ResultItem = styled(Link)`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid var(--color-grey-100, #f3f4f6);
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: var(--color-grey-50, #f9fafb);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: var(--color-grey-100, #f3f4f6);
  }
  
  @media (max-width: 550px) {
    padding: 12px;
  }
`;

// Geliştirilmiş sonuç resmi
const ResultImage = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  background-image: url(${props => props.src || '/default-blog-image.jpg'});
  background-size: cover;
  background-position: center;
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 2px solid white;
  
  @media (max-width: 550px) {
    width: 60px;
    height: 60px;
    margin-right: 12px;
  }
`;

// Sonuç bilgileri
const ResultInfo = styled.div`
  flex: 1;
  min-width: 0; /* Taşmaları önlemek için gerekli */
`;

// Sonuç başlığı
const ResultTitle = styled.h4`
  margin: 0 0 6px;
  color: var(--color-grey-900, #111827);
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  
  @media (max-width: 550px) {
    font-size: 15px;
  }
`;

// Sonuç meta bilgileri
const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: var(--color-grey-500, #6b7280);
  margin-bottom: 6px;
  flex-wrap: wrap;
  
  @media (max-width: 550px) {
    font-size: 12px;
  }
`;

// Kategori etiketi
const ResultCategory = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 12px;
  background-color: var(--color-grey-100, #f3f4f6);
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 12px;
  
  svg {
    margin-right: 4px;
  }
  
  @media (max-width: 550px) {
    padding: 2px 6px;
    font-size: 11px;
  }
`;

// Tarih etiketi
const ResultDate = styled.span`
  display: inline-flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`;

// İçerik özeti
const ResultContent = styled.p`
  margin: 5px 0 0;
  font-size: 13px;
  color: var(--color-grey-600, #4b5563);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  
  @media (max-width: 550px) {
    font-size: 12px;
    -webkit-line-clamp: 1;
  }
`;

// Yükleme animasyonu için iskelet
const SkeletonLoader = styled.div`
  padding: 16px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid var(--color-grey-100, #f3f4f6);
  
  &:last-child {
    border-bottom: none;
  }
`;

const SkeletonImage = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  margin-right: 16px;
  flex-shrink: 0;
  background: linear-gradient(90deg, var(--color-grey-100, #f3f4f6) 25%, var(--color-grey-200, #e5e7eb) 50%, var(--color-grey-100, #f3f4f6) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  
  @media (max-width: 550px) {
    width: 60px;
    height: 60px;
  }
`;

const SkeletonText = styled.div`
  height: ${props => props.height || '16px'};
  width: ${props => props.width || '100%'};
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-grey-100, #f3f4f6) 25%, var(--color-grey-200, #e5e7eb) 50%, var(--color-grey-100, #f3f4f6) 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
  margin-bottom: ${props => props.mb || '10px'};
`;

const SkeletonContent = styled.div`
  flex: 1;
`;

const NoResults = styled.div`
  padding: 24px;
  text-align: center;
  color: var(--color-grey-500, #6b7280);
  
  svg {
    margin: 0 auto 12px;
    display: block;
    color: var(--color-grey-400, #9ca3af);
  }
  
  strong {
    display: block;
    font-size: 16px;
    color: var(--color-grey-700, #374151);
    margin-bottom: 4px;
  }
`;

// Highlight text (search term'i vurgulama)
const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim() || !text) {
    return <span>{text}</span>;
  }
  
  // HTML etiketlerini temizle
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = cleanText.split(regex);
  
  return (
    <>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} style={{ 
            backgroundColor: 'rgba(251, 191, 36, 0.2)', 
            padding: '0 2px',
            borderRadius: '2px',
            color: 'inherit'
          }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
};

// SearchBar komponenti
function SearchBar() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounce mekanizması
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (query.trim().length >= 2) {
        setDebouncedQuery(query);
        setIsSearchOpen(true);
      } else {
        setDebouncedQuery('');
      }
    }, 350); // Biraz daha uzun debounce süresi

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  // Dışarıya tıklandığında sonuçları kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setIsFocused(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Enter tuşuna basıldığında odaklanma
  useEffect(() => {
    function handleKeyDown(e) {
      // Control+K veya Command+K tuş kombinasyonunu yakala
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsFocused(true);
      }
    }
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Arama sorgusu - hatalara karşı daha güçlü
  const {
    data: searchResults,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['blogSearch', debouncedQuery],
    queryFn: () => searchBlogs(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60000, // 1 dakika önbellek
    keepPreviousData: false,
    retry: 1, // Hata durumunda 1 kez daha dene
    refetchOnWindowFocus: false, // Gereksiz yeniden yüklemeleri önle
    onError: (err) => console.error('Arama hatası:', err)
  });

  function handleSearch() {
    if (query.trim().length >= 2) {
      setIsSearchOpen(true);
    }
  }

  function clearSearch() {
    setQuery('');
    setDebouncedQuery('');
    inputRef.current?.focus();
  }

  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Geçerli bir tarih değilse boş döndür
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  }

  // Özet içerik oluştur (HTML etiketlerini kaldırarak)
  function createExcerpt(content, maxLength = 120) {
    if (!content) return '';
    // HTML etiketlerini kaldır
    const textOnly = content.replace(/<[^>]*>/g, '');
    if (textOnly.length <= maxLength) return textOnly;
    return textOnly.substring(0, maxLength) + '...';
  }

  // Görüntülenecek sonuç sayısı
  const showResults = Boolean(isSearchOpen && debouncedQuery.length >= 2);

  return (
    <SearchContainer ref={searchContainerRef}>
      <SearchInputWrapper isFocused={isFocused}>
        <SearchInput
          ref={inputRef}
          type="text"
          placeholder="Bloglar, vizeler, seyahat yazıları..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim().length >= 2) setIsSearchOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        {query && (
          <ClearButton onClick={clearSearch} aria-label="Aramayı temizle">
            <FiX size={18} />
          </ClearButton>
        )}
        <SearchButton onClick={handleSearch} aria-label="Ara">
          <SearchIcon />
        </SearchButton>
      </SearchInputWrapper>
      
      {/* NoResults component also uses the search icon */}
      <ResultsContainer show={showResults}>
        {isLoading ? (
          // Yükleme durumu için iskelet
          <>
            {[1, 2, 3].map((i) => (
              <SkeletonLoader key={i}>
                <SkeletonImage />
                <SkeletonContent>
                  <SkeletonText height="18px" width="70%" mb="12px" />
                  <SkeletonText height="14px" width="40%" mb="10px" />
                  <SkeletonText height="14px" width="90%" mb="6px" />
                  <SkeletonText height="14px" width="60%" mb="0" />
                </SkeletonContent>
              </SkeletonLoader>
            ))}
          </>
        ) : isError ? (
          <NoResults>
            <SearchIcon />
            <strong>Arama sırasında bir hata oluştu</strong>
            <p>{error?.message || 'Lütfen tekrar deneyin veya yöneticinize başvurun'}</p>
          </NoResults>
        ) : !searchResults || searchResults.length === 0 ? (
          <NoResults>
            <SearchIcon />
            <strong>Sonuç bulunamadı</strong>
            <p>Farklı anahtar kelimeler deneyin veya daha genel terimler arayın</p>
          </NoResults>
        ) : (
          searchResults.map((blog) => (
            <ResultItem key={blog.id} to={`/blog/${blog.slug}`} onClick={() => setIsSearchOpen(false)}>
              <ResultImage src={blog.cover_image} />
              <ResultInfo>
                <ResultTitle>
                  <HighlightText text={blog.title} highlight={debouncedQuery} />
                </ResultTitle>
                <ResultMeta>
                  <ResultCategory>
                    <FiTag size={12} />
                    {blog.category}
                  </ResultCategory>
                  <ResultDate>
                    <FiClock size={12} />
                    {formatDate(blog.created_at)}
                  </ResultDate>
                </ResultMeta>
                <ResultContent>
                  <HighlightText 
                    text={createExcerpt(blog.content)} 
                    highlight={debouncedQuery} 
                  />
                </ResultContent>
              </ResultInfo>
            </ResultItem>
          ))
        )}
      </ResultsContainer>
    </SearchContainer>
  );
}

export default SearchBar;