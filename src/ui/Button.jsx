/* eslint-disable no-unused-vars */
import styled, { css } from "styled-components";

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 2.4rem 4.8rem;
    font-weight: 500;
  `,
  login: css`
    height: 44px;
    width: 371px;
    border-radius: 11px !important;
    border: transparent !important;
    font-weight: bold !important;
    @media (max-width: 450px) {
      width: 306px !important;
    }
  `,
  back: css`
    background: #0f8d97 !important;
    color: #87f9cd !important;
    font-weight: bold;
    height: 7rem;
    width: 160px;
    position: fixed;
    z-index: 2991;
    @media (max-width: 710px) {
      height: 60px;
      width: 100px;
    }
    @media (max-width: 450px) {
      height: 40px;
      font-size: 16px;
      width: 80px;
    }
  `,
  dash: css`
    color: #00ffa2 !important;
    font-weight: bold !important;
    border: 4px solid #87f9cd;
    border-radius: 16px;
    font-size: 1.6rem;
    padding: 1.8rem 4.8rem;
    font-weight: 500;
    background: #004466 !important;
    @media (max-width: 1300px) {
      padding: 1.8rem 3.5rem;
    }
    @media (max-width: 1050px) {
      padding: 1.5rem 2.7rem;
    }
    @media (max-width: 830px) {
      padding: 1.3rem 2.5rem;
      font-size: 14px;
    }
    @media (max-width: 710px) {
      display: none;
    }
    &:hover {
      color: #004466 !important;
      background-color: #87f9cd !important;
    }
    &:active {
      box-shadow: none;
    }
  `,
  baslayalim: css`
    height: 40px !important;
    width: 80% !important;
    @media (max-width: 825px) {
      font-size: 14px!important;
    }
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);
    box-shadow: var(--shadow-sm);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  login: css`
    color: var(--color-grey-31);
    background-color: var(--color-grey-61);
  `,
  question: css`
    display: flex;
    align-items: center;
    justify-content: center;
    color: #004466;
    font-weight: bold;
    font-size: 16px;
    background: #00ffa2;
    box-shadow: 0px 10px 1px -1px #2ecc71;
    z-index: 2000;
    width: 400px;
    padding: 1.3rem;
    border-radius: 16px;
    margin-bottom: 12px;
    @media (max-width: 450px) {
      width: 300px;
    }
    @media (max-width: 360px) {
      width: 80%;
    }
    &:hover {
      background: #00ff75;
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);
    box-shadow: var(--shadow-sm);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);
    box-shadow: var(--shadow-sm);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
  photo: css`
    background-color: transparent;

    &:hover {
      border-color: black;
    }
  `,
};

const Button = styled.button`
  border: none;
  border-radius: 7px;

  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
`;

Button.defaultProps = { variation: "primary", size: "medium" };

export default Button;
