import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ContentWrapper = styled.main`
  width: auto;
  padding: 0 16px;
  margin: 6rem auto 2rem auto;
  flex: 1 0 auto;

  @media (min-width: 490px) {
    width: auto;
    padding: 0 24px;
  }

  @media (min-width: 848px) {
    width: 800px;
    padding: 0;
  }
`;

const Content = ({ content }) => <ContentWrapper>{content}</ContentWrapper>;

Content.propTypes = {
  content: PropTypes.object
};

export default Content;
