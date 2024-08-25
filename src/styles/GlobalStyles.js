import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`/*
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
*/

/* Colors adapted from https://tailwindcss.com/docs/customizing-colors */

:root {
  

  /* Grey */

&, &.light-mode{
  --color-box-0: drop-shadow(10px 40px 220px #07ff9c);
  --color-box-1: 42px 10px 140px -7px #004466;
  --color-grey-0: #fff;
  --color-grey-1: #DDFBEF;
  --color-grey-2: #DDFBEF;
  --color-grey-3: linear-gradient(180deg, #00FFA2 100%, #00B78B 15.10%, #00837A 48.44%, #046 0%);
  --color-grey-31: #004466;
  --color-grey-61: #00ffa2;
  --color-grey-50: #DDFBEF;
  --color-grey-51: #DDFBEF;
  --color-grey-52: #004466;
  --color-grey-53: #18212f;
  --color-grey-54: #2ecc71;
  --color-grey-100: #f3f4f6;
  --color-grey-200: #e5e7eb;
  --color-grey-300: #d1d5db;
  --color-grey-400: #9ca3af;
  --color-grey-500: #6b7280;
  --color-grey-600: #4b5563;
  --color-grey-700: #374151;
  --color-grey-800: #1f2937;
  --color-grey-900: #111827;
  --color-grey-901: #00ffa2;
  --color-grey-902: #004466;
  --color-grey-903: #2ecc71;
  --color-grey-904: #004466;
  --color-grey-905: #00ffa2;
  --color-grey-906: linear-gradient(to bottom right, rgba(255, 255, 255, 0.53) 70%, #004466);
  --color-grey-907: url(../public/footer-background.png);
  --color-grey-55: rgba(255, 255, 255, 0.5);
  --stroke-ham-1: #000;

  --color-blue-100: #e0f2fe;
  --color-blue-700: #0369a1;
  --color-green-100: #dcfce7;
  --color-green-700: #15803d;
  --color-yellow-100: #fef9c3;
  --color-yellow-700: #a16207;
  --color-silver-100: #e5e7eb;
  --color-silver-700: #374151;
  --color-indigo-100: #e0e7ff;
  --color-indigo-700: #4338ca;

  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;
  --opacity-1: none;
  --backdrop-color: rgba(255, 255, 255, 0.1);

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);}

  --image-grayscale: 0;
  --image-opacity: 100%;

  &.dark-mode{
    --color-box-0: none;
    --color-box-1: none;
    --color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-51: #414652;
--color-grey-52: #fff;
--color-grey-53: #fff;
--color-grey-54: #4f46e5;
--color-grey-1: #111827;
--color-grey-2: #18212f;
--color-grey-3: #18212f;
--color-grey-69: #004466;
--color-grey-100: #1f2937;
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;
--color-grey-901: transparent;
--color-grey-902: transparent;
--color-grey-903: rgba(255, 255, 255, 0.2);
--color-grey-904: white;
--color-grey-905: rgba(255, 255, 255, 0.2);
--color-grey-906: none;
--color-grey-907: rgba(255, 255, 255, 0.2);
--color-grey-55: #091522;
--stroke-ham-1: #999;

--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--opacity-1: 0.8;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
  }

/* Indigo */
--color-brand-50: #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-200: #c7d2fe;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-800: #3730a3;
  --color-brand-900: #312e81;

  --border-radius-tiny: 3px;
  --border-radius-sm: 5px;
  --border-radius-md: 7px;
  --border-radius-lg: 9px;

  /* For dark mode */
  
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;

  /* Creating animations for dark mode */
  transition: background-color 0.3s, border 0.3s;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Poppins", sans-serif;
  color: var(--color-grey-700);

  transition: color 0.3s, background-color 0.3s;
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-500);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: -1px;
}

/* Parent selector, finally 😃 */
button:has(svg) {
  line-height: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

.hosgeldiniz {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}


.subtext {
  text-align: center;
  font-size: 16px;
}
@media (max-width: 450px) {
  .subtext {
    font-size: 16px;
  }
  .hosgeldiniz {
    font-size: 22px;
  }
}
@media (max-width: 370px) {
  .subtext {
    font-size: 14px;
  }
  .hosgeldiniz {
    font-size: 18px!important;
  }
}

.mobile-scrolldiv {
  padding: 4px 0;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  border: 1px solid white;
  flex-direction: column;
  gap: 2px;
  border-radius: 16px;
  max-height: 250px;
  overflow: auto;
 
}

.question-progressAndContent-container {
  display: flex;
  flex-direction: column;
  gap: 0px;
  @media (max-width: 710px) {
    gap: 0;
  }
}

.handle-delete {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0px;
  width: 100%;
  border-radius: 16px;
}

.mainnav-buzlucam {
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  &:hover {
    background: var(--color-grey-905)!important;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }
}



@media (max-width: 1050px) {
  .sidebartext {
    font-size: 16px;
  }
}
@media (max-width: 830px) {
  .sidebartext {
    font-size: 14px;
  }
}

@media (max-width: 710px) {
  .stepsAndNames {
    flex-flow: row!important;
    align-items: center;
    gap: 10px;
  }
}


.navbar-dash {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
}

img {
  max-width: 100%;

  /* For dark mode */
  filter: grayscale(var(--image-grayscale)) opacity(var(--image-opacity));
}

Slider h2 span {
  color: #004466;
  text-align: center;
}

.icon-area {
  margin-top: 150px;
  width: 100%;
}

.slick-slide {
  margin: 0 20px;

}

.slick-slide img {
  max-height: 100%;
  width: 100%;
}

.slick-list {
  position: relative;
  display: block;
  overflow: hidden;
  margin: 0%;
}

.slick-list:focus {
  outline: none;
}

.slick-slide {
  display: none;
  float: left;
  height: 100%;
  min-height: 1px;
}

.slick-slide img {
  display: block;
}

.slick-initialized .slick-slide {
  display: block;
}

.slick-loading .slick-slide {
  visibility: hidden;
}

.slide img {
  height: 100px;
  width: 100px;
  padding: 0 9px;
}



.bulten-abone {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 92px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 92px;
  width: 1111px;
  height: 400px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 40px;
  background-image: var(--color-grey-906);
}

@media (max-width: 1150px) {
  .bulten-abone {
      width: 400px !important;
      height: 779px !important;
      flex-flow: wrap !important;
      justify-content: space-around !important;
  }

  .bulten-inputvelogo {
      flex-flow: column-reverse;
  }

  .bulten-input {
      width: 360px !important;
      margin-left: 20px;
  }

  .bulten-header {
      margin-left: 20px;
  }

  .bulten-subtext {
      margin-left: 20px;
  }

  .bulten-logo1 {
      margin-right: 20px;
      width: 180px !important;
      height: auto !important;
  }
}

@media (max-width: 410px) {
  .bulten-abone {
      width: 350px !important;
      height: 660px !important;
  }

  .bulten-header {
      font-size: 50px !important;
  }

  .bulten-subtext {
      font-size: 20px !important;
  }

  .bulten-input {
      width: 300px !important;
  }
}

.bulten-header {
  max-width: 400px;
  font-weight: 700;
  font-size: 67px;
  letter-spacing: -0.055em;
  background: linear-gradient(89.93deg, rgba(77, 64, 244, 0.9) 3.65%, rgba(133, 58, 204, 0.9) 86.54%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

}

.bulten-subtext {
  max-width: 500px;
  font-weight: 600;
  font-size: 22px;
  line-height: 141%;
  letter-spacing: 0.01em;
  color: var(--color-grey-600);

}

.bulten-input {
  display: flex;
  align-items: center;
  margin-right: 30px;
  width: 467px;
  height: 57px;
  background: #FFFFFF;
  box-shadow: 0px 4px 120px rgba(142, 131, 113, 0.15);
  border-radius: 11px;
}

.bulten-mail {
  padding-left: 2.5rem;
  border: 2px solid transparent;
  border-radius: 8px;
  outline: none;
  background-color: transparent;
  color: #0d0c22;
  transition: .3s ease;
}

.bulten-abone-buton {
  width: 198px;
  height: 47px;
  background: #004466;
  box-shadow: 0px 6px 0px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  font-weight: 700;
  font-size: 20px;
  text-align: center;
  color: #00FFA2;
  margin-top: -20px;

}

.footer {
  margin-top: 200px;
  border-radius: 100% / 40% 40% 0% 0%;
  width: 100%;
  height: 565px;
  background: var(--color-grey-907);
  background-size: cover;
  background-position: center;
  opacity: 0.92;
  @media (max-width: 750px) {
    height: 100%;
    min-height: 750px;
  }

}


.footer-header {
  margin-top: 89px;
  max-width: 80%;
  font-family: 'DM Serif Display';
  font-style: normal;
  font-weight: 600;
  font-size: 60px;
  line-height: 60px;
  text-align: center;
  color: var(--color-grey-600);
}

.ceper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 283px;
  height: 127px;
  border: 3px solid #00FFA2;
  filter: drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.11));
  border-radius: 82px;
}

.footer-buton {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 248.6px;
  height: 89px;
  background: #004466;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.11);
  border-radius: 49px;
  font-weight: 700;
  font-size: 24px;
  text-align: center;
  color: #00FFA2;
}

.footer-buton:hover {
  background-color: #00FFA2;
  color: #004466;
}

.ceper:hover {
  border-color: #004466;
}

.footer-divider {
  margin-top: 31px;
  margin-bottom: 35px;
  width: 100%;
  background-color: #FFFFFF;
  height: 1px;
  margin-left: auto;
  margin-right: auto;
}

.footer-links {
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: var(--color-grey-600);

}

@media (max-width: 1070px) {
  .footer-header {
      font-size: 45px;
  }

  .footer-buton {
      width: 248px;
      height: 89px;
  }

}

@media (max-width: 1000px) {
  .footer {
    height: 680px;
}

.footer-wrap {
    flex-flow: column-reverse;
    gap: 33px;
}
}

/*
FOR DARK MODE

--color-grey-0: #18212f;
--color-grey-50: #111827;
--color-grey-100: #1f2937;
--color-grey-200: #374151;
--color-grey-300: #4b5563;
--color-grey-400: #6b7280;
--color-grey-500: #9ca3af;
--color-grey-600: #d1d5db;
--color-grey-700: #e5e7eb;
--color-grey-800: #f3f4f6;
--color-grey-900: #f9fafb;


--color-blue-100: #075985;
--color-blue-700: #e0f2fe;
--color-green-100: #166534;
--color-green-700: #dcfce7;
--color-yellow-100: #854d0e;
--color-yellow-700: #fef9c3;
--color-silver-100: #374151;
--color-silver-700: #f3f4f6;
--color-indigo-100: #3730a3;
--color-indigo-700: #e0e7ff;

--color-red-100: #fee2e2;
--color-red-700: #b91c1c;
--color-red-800: #991b1b;

--backdrop-color: rgba(0, 0, 0, 0.3);

--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.4);
--shadow-md: 0px 0.6rem 2.4rem rgba(0, 0, 0, 0.3);
--shadow-lg: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.4);

--image-grayscale: 10%;
--image-opacity: 90%;
*/
`;

export default GlobalStyles;
