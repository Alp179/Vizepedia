/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  z-index: 3000;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-919);
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  justify-content: space-between;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed; /* Sayfanın tamamını kapsaması için fixed yapıyoruz */
  z-index: 9999; /* En üstte görünecek şekilde ayarlanıyor */
  top: 0;
  left: 0;
  width: 100vw; /* Tüm genişliği kapla */
  height: 100vh; /* Tüm yüksekliği kapla */
  background-color: var(--backdrop-color); /* Arka plan rengini ayarla */
  backdrop-filter: blur(4px); /* Tüm arka planı blur yap */
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;
  z-index: 9999;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;

const ModalContext = createContext();

function ModalSignup({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);
  if (name !== openName) return null;

  // Using createPortal to render the modal at the root level
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>{" "}
        {/* onCloseModal prop'u burada geçiliyor */}
      </StyledModal>
    </Overlay>,
    document.getElementById("modal-root") // Make sure there's a div with this id in your HTML
  );
}

ModalSignup.Open = Open;
ModalSignup.Window = Window;

export default ModalSignup;
