import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";

const StyledVectorOk = styled.div`
  ${(props) =>
    props.variant === "blogpage" &&
    css`
      width: 590px;
      height: 106px;
      @media (max-width: 910px) {
        width: 450px;
        height: 40px;
      }
      @media (max-width: 810px) {
        width: 380px;
        height: 20px;
      }
      @media (max-width: 550px) {
        width: 340px;
        height: 15px;
      }
      @media (max-width: 450px) {
        width: 272px;
      }
      @media (max-width: 350px) {
        width: 200px;
      }
    `}
`;

const Img = styled.img`
  user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

function VectorOk({ variant }) {
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode
    ? "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vector2.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZlY3RvcjIucG5nIiwiaWF0IjoxNzI4MTQzODg3LCJleHAiOjM1NjQ5Njk2MzgyODd9.l06sT-VF7jyLhiSDNDrSLdj_ncGGA3hdcLyQKJIQ0ME&t=2024-10-05T15%3A58%3A07.804Z"
    : "https://ibygzkntdaljyduuhivj.supabase.co/storage/v1/object/sign/logo/vector1.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJsb2dvL3ZlY3RvcjEucG5nIiwiaWF0IjoxNzI4MTQzODY0LCJleHAiOjM1NjQ5NzEzNjYyNjR9.FLojty1eZXLcpfwzzlEIOg-F-NICC-Wm3whMOmdu69Y&t=2024-10-05T15%3A57%3A44.599Z";

  return (
    <StyledVectorOk variant={variant}>
      <Img src={src} alt="Vector" />
    </StyledVectorOk>
  );
}

VectorOk.propTypes = {
  variant: PropTypes.string, // Define the expected type for `variant`
};

export default VectorOk;
