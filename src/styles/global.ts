import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

html {
  height: 100%;
  background-color: #ffb901;

  @media (max-width: 630px) {
    min-height: 780px;
  }
}

body {
  background: linear-gradient(#ff8100,#ffb901);
  color: #222;
  -webkit-font-smoothing: antialiased;
}

body, input, button {
  font-family: 'Roboto Slab', serif;
  font-weight: 400;
  font-size: 16px;
}

h1, h2, h3, h4, h5, h6, strong {
  font-weight: 700;
}

button {
  cursor: pointer;
}
`;
