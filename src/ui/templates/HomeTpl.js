import React from 'react';
import { Helmet } from 'react-helmet';

import Container from '@material-ui/core/Container';
// import makeStyles from '@material-ui/core/styles/makeStyles';

import Layout from '@ui/components/Layout';
import sections from '@ui/config/sections';
import withTheme from '@ui/themes/withTheme';

// const useStyles = makeStyles(theme => ({}));

const HomeTpl = ({ _frontmatter, children, ...props }) => {
  // const classes = useStyles();

  console.group('HomeTpl.js');
  console.log(props);
  console.groupEnd();

  return (
    <Layout {...props}>
      <Helmet>
        <title>{_frontmatter.title}</title>
      </Helmet>
      <Container component="main" maxWidth="md">
        {children}
      </Container>
    </Layout>
  );
};

export default withTheme(HomeTpl, sections.partners.color);
