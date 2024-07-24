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
    height: 7rem;
    width: 160px;
    position: fixed;
    z-index: 3000;
    @media (max-width: 450px) {
      height: 6rem;
      width: 120px;
    }
  `,
  dash: css`
    font-size: 1.6rem;
    padding: 2.4rem 4.8rem;
    font-weight: 500;
    @media (max-width: 1300px) {
      padding: 1.8rem 3.5rem;
    }
    @media (max-width: 830px) {
      padding: 1.5rem 2.7rem;
      font-size: 15px;
    }
    @media (max-width: 710px) {
      display: none;
    }
  `,
  question: css`
    z-index: 2000;
    width: 200px;
    padding: 1.3rem;
    border-radius: 8px;
    margin-bottom: 20px;
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
