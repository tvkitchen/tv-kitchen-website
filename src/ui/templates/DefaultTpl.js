import React from 'react';
import { Helmet } from 'react-helmet';

import Container from '@material-ui/core/Container';
// import makeStyles from '@material-ui/core/styles/makeStyles';

import colors from '@ui/themes/colors';
import Layout from '@ui/components/Layout';
import withTheme from '@ui/themes/withTheme';

// const useStyles = makeStyles(theme => ({}));

const DefaultTpl = ({ children, pageContext, ...props }) => {
  // const classes = useStyles();

  return (
    <Layout {...props}>
      <Helmet>
        <title>{pageContext.frontmatter.title}</title>
      </Helmet>
      <Container component="main" maxWidth="md">
        {children}
      </Container>
    </Layout>
  );
};

export default withTheme(DefaultTpl, colors.blue);
