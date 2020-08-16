import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

import Container from '@material-ui/core/Container';
// import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from '@src/components/Layout';
import config from '@src/config';
import withTheme from '@src/themes/withTheme';

// const useStyles = makeStyles(theme => ({}));

const PartnersTpl = ({
  data: {
    mdx: { frontmatter },
  },
  ...props
}) => {
  // const classes = useStyles();

  return (
    <Layout {...props}>
      <Helmet>
        <title>{frontmatter.title}</title>
      </Helmet>
      <Container component="main" maxWidth="md">
        Hello Partners Page
      </Container>
    </Layout>
  );
};

export default withTheme(PartnersTpl, config.sections.partners.color);

export const pageQuery = graphql`
  query PartnersTplQuery($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
      }
    }
  }
`;
