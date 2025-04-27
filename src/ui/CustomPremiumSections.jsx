/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import styled, { keyframes, ThemeProvider } from "styled-components";
import { useDarkMode } from "../context/DarkModeContext"; // Dark mode context'i import ediyoruz

// Theme
const theme = {
  easing: {
    default: "cubic-bezier(0.16, 1, 0.3, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  motion: {
    fast: "0.3s",
    medium: "0.5s",
    slow: "0.8s",
    extraSlow: "1.2s",
  },
};

// Animations
const contentFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 300% 0;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Root container
const RootContainer = styled.div`
  position: relative;
  width: 100%;
  z-index: 20;
`;

// Sections container
const SectionsContainer = styled.div`
  position: relative;
  width: 100%;
`;

// Section - Dark/Light mode için güncellendi
const Section = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: ${(props) =>
    props.isDarkMode
      ? props.bgColor || "#090909"
      : props.lightBgColor || "#f8f9fa"};
  color: ${(props) =>
    props.isDarkMode
      ? props.textColor || "#fff"
      : props.lightTextColor || "#333"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 100vh;
  }
`;

// Progress Indicator - Dark/Light mode için güncellendi
const ProgressIndicator = styled.div`
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 100;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease;

  @media (max-width: 768px) {
    right: 1rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    right: 0.5rem;
    gap: 0.8rem;
  }
`;

// Dark/Light mode için güncellendi
const Dot = styled.div`
  position: relative;
  width: 12px;
  height: 12px;
  border: 2px solid
    ${(props) =>
      props.isDarkMode
        ? `rgba(255, 255, 255, ${props.active ? 1 : 0.3})`
        : `rgba(0, 0, 0, ${props.active ? 1 : 0.3})`};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${(props) => (props.active ? "6px" : "0")};
    height: ${(props) => (props.active ? "6px" : "0")};
    background-color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};
    border-radius: 50%;
    transition: all 0.3s ${(props) => props.theme.easing.spring};
  }

  &:hover {
    &::before {
      width: 6px;
      height: 6px;
    }
  }

  @media (max-width: 480px) {
    width: 10px;
    height: 10px;

    &::before {
      width: ${(props) => (props.active ? "5px" : "0")};
      height: ${(props) => (props.active ? "5px" : "0")};
    }
  }
`;

// ContentPanel - Mobil için aşağı konumlandırma
const ContentPanel = styled.div`
  position: absolute;
  width: ${(props) => (props.isMobile ? "90%" : "40%")};
  ${(props) =>
    !props.isMobile &&
    `${props.position === "left" ? "left: 10%;" : "right: 10%;"}`}
  ${(props) => props.isMobile && "left: 5%;"}
  top: ${(props) =>
    props.isMobile
      ? "15%"
      : "35%"}; // Mobilde daha aşağı konumlandırma: 5%'ten 15%'e
  transform: translateY(${(props) => props.translateY || "0px"});
  z-index: 10;
  transition: transform 0.8s ${(props) => props.theme.easing.default},
    opacity 0.8s ${(props) => props.theme.easing.default};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  animation: ${contentFadeIn} 0.8s ${(props) => props.theme.easing.spring}
    forwards;

  @media (max-width: 768px) {
    width: 90%;
    left: 5%;
    right: auto;
    top: 18%; // Daha aşağı konumlandırma: 8%'den 18%'e
  }

  @media (max-width: 480px) {
    width: 90%;
    left: 5%;
    top: 15%; // Daha aşağı konumlandırma: 5%'ten 15%'e
  }
`;

// Title - Yazı boyutu %50 daha büyütüldü
const Title = styled.h1`
  font-size: 6.5rem; // %50 daha büyütüldü (önceki: 4.5rem)
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  position: relative;
  margin-bottom: 1.2rem;

  background: linear-gradient(
    to right,
    ${(props) =>
      props.isDarkMode
        ? `${props.gradientStart || "#fff"} 20%, ${
            props.gradientMid || "#e0e0e0"
          } 50%, ${props.gradientEnd || "#fff"} 80%`
        : `${props.lightGradientStart || "#333"} 20%, ${
            props.gradientMid || "#666"
          } 50%, ${props.lightGradientEnd || "#333"} 80%`}
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 5s linear infinite;

  @media (max-width: 768px) {
    font-size: 5.2rem; // %50 daha büyütüldü (önceki: 3.5rem)
    margin-bottom: 1rem;
    line-height: 1;
  }

  @media (max-width: 480px) {
    font-size: 5rem; // %50 daha büyütüldü (önceki: 3.3rem)
    margin-bottom: 0.8rem;
    line-height: 1;
  }
`;

// Subtitle - Yazı boyutu %50 daha büyütüldü
const Subtitle = styled.h2`
  font-size: 3rem; // %50 daha büyütüldü (önceki: 2rem)
  font-weight: 500;
  margin-bottom: 1.8rem;
  color: ${(props) =>
    props.isDarkMode
      ? props.color || "rgba(255, 255, 255, 0.7)"
      : props.lightColor || "rgba(0, 0, 0, 0.7)"};
  position: relative;

  @media (max-width: 768px) {
    font-size: 2.7rem; // %50 daha büyütüldü (önceki: 1.8rem)
    margin-bottom: 1.2rem;
    line-height: 1.2;
  }

  @media (max-width: 480px) {
    font-size: 2.7rem; // %50 daha büyütüldü (önceki: 1.8rem)
    margin-bottom: 1rem;
    line-height: 1.2;
  }
`;

// Description - Yazı boyutu %50 daha büyütüldü
const Description = styled.p`
  font-size: 1.65rem; // %15 küçültüldü (önceki: 1.95rem)
  line-height: 1.6;
  position: relative;
  max-width: 95%;
  color: ${(props) =>
    props.isDarkMode
      ? props.color || "rgba(255, 255, 255, 0.8)"
      : props.lightColor || "rgba(0, 0, 0, 0.7)"};

  @media (max-width: 768px) {
    font-size: 1.75rem; // %15 küçültüldü (önceki: 1.95rem)
    line-height: 1.6;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem; // %15 küçültüldü (önceki: 2rem)
    line-height: 1.6;
    max-width: 100%;
  }
`;

// 3D Frame Effect - Kare görünüm ve daha yukarı konumlandırma için güncellendi
const ThreeDFrame = styled.div`
  width: ${(props) => (props.isMobile ? "70%" : "35%")};
  height: ${(props) => (props.isMobile ? "35%" : "35vw")};
  position: absolute;
  top: ${(props) =>
    props.isMobile
      ? "60%"
      : "50%"}; // Daha yukarı konumlandırma için 70%'den 60%'e düşürüldü
  ${(props) =>
    !props.isMobile &&
    `${props.position === "left" ? "left: 10%;" : "right: 10%;"}`}
  ${(props) => props.isMobile && "left: 15%;"}
  transform: translateY(-50%) translateY(${(props) =>
    props.translateY || "0px"}) ${(props) => props.transform || ""};
  z-index: 10;
  transition: transform 0.8s ${(props) => props.theme.easing.default},
    opacity 0.8s ${(props) => props.theme.easing.default};
  opacity: ${(props) => (props.visible ? 1 : 0)};
  aspect-ratio: 1/1;

  @media (max-width: 768px) {
    width: 70%;
    height: 70vw;
    left: 15%;
    top: 67%; // Mobilde de yukarı çekildi
    aspect-ratio: 1/1;
  }

  @media (max-width: 480px) {
    width: 85%;
    height: 85vw;
    left: 5.5%;
    top: 70%; // Mobilde daha da yukarı çekildi
    aspect-ratio: 1/1;
  }
`;

// 3D Model Frame - Transform değerleri güncellendi
const ModelFrame = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: ${(props) => props.rotate || "rotateY(15deg)"};
  transition: transform 1.2s ${(props) => props.theme.easing.spring};
  animation: ${float} 10s infinite ease-in-out;
  aspect-ratio: 1/1; // Kare görünüm koruma

  &:hover {
    transform: rotateY(25deg);
  }

  @media (max-width: 480px) {
    animation: ${float} 8s infinite ease-in-out;

    &:hover {
      transform: rotateY(20deg);
    }
  }
`;

// Model Display Card - Border-radius değerleri güncellendi
const ModelCard = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background: ${(props) =>
    props.isDarkMode
      ? props.gradient ||
        "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))"
      : props.lightGradient ||
        "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0.01))"};
  border-radius: 20px;
  box-shadow: ${(props) =>
    props.isDarkMode
      ? "0 15px 35px rgba(0, 0, 0, 0.2)"
      : "0 15px 35px rgba(0, 0, 0, 0.1)"};
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(props) =>
      props.isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)"};
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1/1; // Kare görünüm koruma

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${(props) =>
      props.isDarkMode
        ? props.shine ||
          "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))"
        : props.lightShine ||
          "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(0,0,0,0))"};
    z-index: 2;
    opacity: 0.5;
  }

  @media (max-width: 480px) {
    border-radius: 16px;
    box-shadow: ${(props) =>
      props.isDarkMode
        ? "0 10px 25px rgba(0, 0, 0, 0.15)"
        : "0 10px 25px rgba(0, 0, 0, 0.08)"};
  }
`;
// Scroll Arrow - Pozisyonu güncellendi
const ScrollArrow = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  transition: opacity 0.5s ease, transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateX(-50%) translateY(5px);
  }

  svg {
    width: 36px;
    height: 36px;
    fill: ${(props) =>
      props.isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"};
    animation: ${float} 2s infinite ease-in-out;
  }

  @media (max-width: 768px) {
    bottom: 1.5rem;

    svg {
      width: 30px;
      height: 30px;
    }
  }

  @media (max-width: 480px) {
    bottom: 1rem;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

// Background Effects - Dark/Light mode için güncellendi
const BackgroundGlow = styled.div`
  position: absolute;
  width: ${(props) => props.size || "50vw"};
  height: ${(props) => props.size || "50vw"};
  border-radius: 50%;
  background: ${(props) =>
    props.isDarkMode
      ? `radial-gradient(circle, ${
          props.color || "rgba(255, 255, 255, 0.1)"
        }, transparent 70%)`
      : `radial-gradient(circle, ${
          props.lightColor || "rgba(0, 0, 0, 0.03)"
        }, transparent 70%)`};
  top: ${(props) => props.top || "0"};
  left: ${(props) => props.left || "0"};
  right: ${(props) => props.right || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  opacity: ${(props) => props.opacity || 0.3};
  filter: blur(${(props) => props.blur || "50px"});
  pointer-events: none;
  z-index: 1;

  @media (max-width: 480px) {
    filter: blur(${(props) => props.mobileBlur || props.blur || "30px"});
  }
`;

// Background Dots - Dark/Light mode için güncellendi
const BackgroundDots = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${(props) =>
    props.isDarkMode
      ? "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)"
      : "radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px)"};
  background-size: 30px 30px;
  opacity: 0.3;
  z-index: 0;

  @media (max-width: 480px) {
    background-size: 20px 20px;
  }
`;

// Swipe Indicator - Tıklanabilir olarak güncellendi
const SwipeIndicator = styled.div`
  position: absolute;
  bottom: 1.8rem;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"};
  font-size: 1.2rem; // Büyütüldü
  letter-spacing: 0.5px;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  transition: opacity 0.5s ease, transform 0.3s ease;
  padding: 8px 16px; // Click alanını genişletmek için padding eklendi
  background-color: ${(props) =>
    props.isDarkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)"};
  backdrop-filter: blur(5px);
  border-radius: 20px;
  cursor: pointer; // Pointer cursor gösterilmesi sağlandı

  &:hover {
    transform: translateX(-50%) translateY(3px);
  }

  @media (max-width: 768px) {
    display: flex;
    bottom: 0.8rem;
    font-size: 1.4rem; // Büyütüldü
  }

  @media (max-width: 480px) {
    bottom: 0.6rem;
    font-size: 1.5rem; // Büyütüldü
    padding: 8px 20px; // Tıklama alanı genişletildi
  }

  svg {
    width: 22px; // Büyütüldü
    height: 22px; // Büyütüldü
    fill: ${(props) =>
      props.isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"};
    margin-right: 6px;

    @media (max-width: 480px) {
      width: 24px; // Büyütüldü
      height: 24px; // Büyütüldü
    }
  }
`;

// Model Display Component - Dark/Light mode için güncellendi
const ModelDisplay = ({ image, accentColor, isDarkMode }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: accentColor,
        padding: "8%", // Görselin boyutunu artırmak için padding azaltıldı
      }}
    >
      <img
        src={image}
        alt="Feature visualization"
        style={{
          width: "96%", // %20 artırıldı (80% → 96%)
          height: "96%", // %20 artırıldı (80% → 96%)
          objectFit: "contain", // İçeriği bozmadan sığdır
          objectPosition: "center", // Merkeze hizala
          borderRadius: "18px", // Görsele yuvarlatılmış köşeler eklendi
          filter: `drop-shadow(0 0 20px ${accentColor}${
            isDarkMode ? "66" : "40"
          })`,
        }}
      />
    </div>
  );
};
// Light mode için renk ayarlamaları
const getLightModeColors = (accent) => {
  const colors = {
    "#6366F1": {
      // mor için
      bg: "#f2f3ff",
      text: "#4f46e5",
      accent: "#4f46e5",
    },
    "#10B981": {
      // yeşil için
      bg: "#f0fdf6",
      text: "#047857",
      accent: "#047857",
    },
    "#EC4899": {
      // pembe için
      bg: "#fdf2f8",
      text: "#be185d",
      accent: "#be185d",
    },
    "#3B82F6": {
      // mavi için
      bg: "#eff6ff",
      text: "#1d4ed8",
      accent: "#1d4ed8",
    },
    "#F59E0B": {
      // turuncu için
      bg: "#fffbeb",
      text: "#b45309",
      accent: "#b45309",
    },
    "#8B5CF6": {
      // mor için
      bg: "#f5f3ff",
      text: "#6d28d9",
      accent: "#6d28d9",
    },
  };

  return colors[accent] || { bg: "#f8f9fa", text: "#333", accent: accent };
};

const CustomPremiumSections = ({ onComplete }) => {
  const { isDarkMode } = useDarkMode(); // Dark mode durumunu alıyoruz
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const observerRef = useRef(null);

  // Mobil cihaz tespiti
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Feature data
  const sections = [
    {
      id: "free",
      title: "Tamamen Ücretsiz",
      subtitle: "Vize danışmanlık giderlerinden tasarruf",
      description:
        "Vizepedia, size ücretsiz bir hizmet sunarak, vize başvuru sürecindeki danışmanlık giderlerinden tasarruf etmenize yardımcı olur ve seyahat bütçenizi optimize eder.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/anasayfa//image7.png",
      bgColor: "#090909",
      accent: "#6366F1",
      textPositioning: "right",
    },
    {
      id: "time",
      title: "Zaman Tasarrufu",
      subtitle: "Verimli süreç yönetimi",
      description:
        "Vizepedia, vize başvuru sürecine ilişkin bilgilere kolay ve hızlı bir şekilde erişimenizi sağlayarak, süreç yönetimini daha verimli hale getirir. Böylece, süreci daha rahat ve keyifli bir deneyime dönüştürebilirsiniz.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/anasayfa//image.png",
      bgColor: "#090909",
      accent: "#10B981",
      textPositioning: "left",
    },
    {
      id: "interface",
      title: "Ferah Arayüz",
      subtitle: "Kullanıcı dostu deneyim",
      description:
        "Vizepedia, kullanıcıların ihtiyaçlarına göre tasarlanmış kullanıcı dostu bir arayüz sunarak, vize başvuru süreci boyunca rahat ve sorunsuz bir deneyim yaşamanıza yardımcı olur.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/anasayfa//image1.png",
      bgColor: "#090909",
      accent: "#EC4899",
      textPositioning: "right",
    },
    {
      id: "updated",
      title: "Güncel ve Doğru",
      subtitle: "Her zaman güncel bilgiler",
      description:
        "Vizepedia, vize başvuru süreçlerindeki değişiklikleri ve güncellemeleri yakından takip ederek, size her zaman en güncel ve doğru bilgileri sunar. Bu sayede, güncel bilgilere güvenerek başvurularınızı gerçekleştirin.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/anasayfa//image2.png",
      bgColor: "#090909",
      accent: "#3B82F6",
      textPositioning: "left",
    },
    {
      id: "documents",
      title: "En Uygun Belgeler",
      subtitle: "Özel belge listeleri",
      description:
        "Vizepedia, seyahat planlarınıza özel olarak hazırlanmış belge listeleriyle, vize başvuru sürecinizi profesyonel ve sistematik bir şekilde yönetmenize imkan tanır.",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/anasayfa//image3.png",
      bgColor: "#090909",
      accent: "#F59E0B",
      textPositioning: "right",
    },
    {
      id: "process",
      title: "Süreç Takibi",
      subtitle: "Kolay süreç takibi",
      description:
        "Vizepedia, vize başvuru sürecinde her adımda size rehberlik eder ve sürecinizi kolayca takip etmenize imkan tanır. Kontrol hep sizde!",
      image:
        "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/public/anasayfa//image5.png",
      bgColor: "#090909",
      accent: "#8B5CF6",
      textPositioning: "left",
    },
  ];

  // Kullanıcının görüş alanına giren bölümleri izleyen Intersection Observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-50% 0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    };

    // Section görünürlüğünü takip et
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.dataset.index, 10);

        if (entry.isIntersecting) {
          setCurrentSectionIndex(index);
          setIsVisible(true);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, options);

    // Referansları kaydet ve observer ekle
    sectionsRef.current.forEach((section) => {
      if (section) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Komponent görünür alanı izleme
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-20% 0px",
      threshold: 0.1,
    };

    const handleContainerVisibility = (entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    };

    const containerObserver = new IntersectionObserver(
      handleContainerVisibility,
      options
    );

    if (containerRef.current) {
      containerObserver.observe(containerRef.current);
    }

    return () => {
      containerObserver.disconnect();
    };
  }, []);

  // Seçili section'a scroll
  const scrollToSection = (index) => {
    if (sectionsRef.current[index]) {
      sectionsRef.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Bir sonraki section'a scroll
  const scrollToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      scrollToSection(currentSectionIndex + 1);
    } else if (typeof onComplete === "function") {
      onComplete();
    }
  };

  // Klavye navigasyonu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        if (currentSectionIndex < sections.length - 1) {
          scrollToSection(currentSectionIndex + 1);
        } else if (typeof onComplete === "function") {
          onComplete();
        }
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        if (currentSectionIndex > 0) {
          scrollToSection(currentSectionIndex - 1);
        }
      } else if (e.key === "Escape" && typeof onComplete === "function") {
        onComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSectionIndex, onComplete, sections.length]);

  // Mobil swipe olaylarını yönet
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSwipeDown = distance < -50;
    const isSwipeUp = distance > 50;

    if (isSwipeUp) {
      // Aşağı kaydırma - sonraki bölüm
      if (currentSectionIndex < sections.length - 1) {
        scrollToSection(currentSectionIndex + 1);
      } else if (typeof onComplete === "function") {
        onComplete();
      }
    } else if (isSwipeDown) {
      // Yukarı kaydırma - önceki bölüm
      if (currentSectionIndex > 0) {
        scrollToSection(currentSectionIndex - 1);
      }
    }

    // Dokunmatik durum sıfırlama
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Transform değerleri hesapla
  const getTransformValues = (index) => {
    const isCurrent = index === currentSectionIndex;
    const isPrevious = index === currentSectionIndex - 1;
    const isNext = index === currentSectionIndex + 1;

    let translateY = "0px";
    let opacity = 0;

    if (isCurrent) {
      translateY = "0px";
      opacity = 1;
    } else if (isPrevious) {
      translateY = "-100px";
      opacity = 0.3;
    } else if (isNext) {
      translateY = "100px";
      opacity = 0.3;
    }

    return { translateY, opacity };
  };

  return (
    <ThemeProvider theme={theme}>
      <RootContainer
        ref={containerRef}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchMove={isMobile ? handleTouchMove : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <SectionsContainer>
          {sections.map((section, index) => {
            const { translateY, opacity } = getTransformValues(index);
            const addRef = (el) => {
              sectionsRef.current[index] = el;
            };
            const lightColors = getLightModeColors(section.accent);

            return (
              <Section
                key={section.id}
                ref={addRef}
                data-index={index}
                bgColor={section.bgColor}
                lightBgColor={lightColors.bg}
                isDarkMode={isDarkMode}
              >
                {/* Background Effects */}
                <BackgroundDots isDarkMode={isDarkMode} />

                <BackgroundGlow
                  color={`${section.accent}40`}
                  lightColor={`${lightColors.accent}15`}
                  top="10%"
                  right="10%"
                  size="40vw"
                  blur="70px"
                  mobileBlur="40px"
                  opacity="0.4"
                  isDarkMode={isDarkMode}
                />

                <BackgroundGlow
                  color={`${section.accent}30`}
                  lightColor={`${lightColors.accent}10`}
                  bottom="10%"
                  left="10%"
                  size="35vw"
                  blur="60px"
                  mobileBlur="35px"
                  opacity="0.3"
                  isDarkMode={isDarkMode}
                />

                {/* Text Content */}
                {/* Text Content - ikonlar kaldırıldı */}
                <ContentPanel
                  position={section.textPositioning}
                  translateY={translateY}
                  visible={opacity > 0}
                  isMobile={isMobile}
                >
                  {/* IconWrapper kaldırıldı */}

                  <Title
                    gradientStart="#fff"
                    lightGradientStart="#000"
                    gradientMid={section.accent}
                    gradientEnd="#f5f5f5"
                    lightGradientEnd="#333"
                    isDarkMode={isDarkMode}
                  >
                    {section.title}
                  </Title>

                  <Subtitle
                    color={`${section.accent}DD`}
                    lightColor={lightColors.accent}
                    isDarkMode={isDarkMode}
                  >
                    {section.subtitle}
                  </Subtitle>

                  <Description
                    isDarkMode={isDarkMode}
                    color="rgba(255, 255, 255, 0.8)"
                    lightColor="rgba(0, 0, 0, 0.7)"
                  >
                    {section.description}
                  </Description>
                </ContentPanel>

                {/* 3D Model Display */}
                <ThreeDFrame
                  position={
                    section.textPositioning === "left" ? "right" : "left"
                  }
                  translateY={translateY}
                  visible={opacity > 0}
                  transform={
                    index === currentSectionIndex
                      ? `rotateY(${
                          section.textPositioning === "left"
                            ? "15deg"
                            : "-15deg"
                        })`
                      : ""
                  }
                  isMobile={isMobile}
                >
                  <ModelFrame>
                    <ModelCard
                      gradient={`linear-gradient(135deg, ${section.accent}15, ${section.accent}05)`}
                      lightGradient={`linear-gradient(135deg, ${lightColors.accent}10, ${lightColors.accent}01)`}
                      shine={`radial-gradient(circle at 70% 30%, ${section.accent}40, transparent 50%)`}
                      lightShine={`radial-gradient(circle at 70% 30%, ${lightColors.accent}20, transparent 50%)`}
                      isDarkMode={isDarkMode}
                    >
                      <ModelDisplay
                        image={section.image}
                        accentColor={
                          isDarkMode ? section.accent : lightColors.accent
                        }
                        isDarkMode={isDarkMode}
                      />
                    </ModelCard>
                  </ModelFrame>
                </ThreeDFrame>

                {/* Scroll Arrow - Son section'da gizle */}
                {index === currentSectionIndex && !isMobile && (
                  <ScrollArrow
                    onClick={scrollToNextSection}
                    hidden={index === sections.length - 1}
                    isDarkMode={isDarkMode}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                    </svg>
                  </ScrollArrow>
                )}

                {/* Swipe indicator - Sadece mobilde görünür ve tıklanabilir */}
                {index === currentSectionIndex && isMobile && (
                  <SwipeIndicator
                    hidden={index === sections.length - 1}
                    isDarkMode={isDarkMode}
                    onClick={scrollToNextSection} // Tıklama ile kaydırma eklendi
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" transform="rotate(90 12 12)" />
                    </svg>
                    <span>Kaydır</span>
                  </SwipeIndicator>
                )}
              </Section>
            );
          })}
        </SectionsContainer>

        {/* Progress Indicator */}
        <ProgressIndicator visible={isVisible}>
          {sections.map((_, index) => (
            <Dot
              key={index}
              active={index === currentSectionIndex}
              onClick={() => scrollToSection(index)}
              isDarkMode={isDarkMode}
            />
          ))}
        </ProgressIndicator>
      </RootContainer>
    </ThemeProvider>
  );
};

export default CustomPremiumSections;
