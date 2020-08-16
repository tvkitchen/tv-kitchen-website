import React from 'react';

import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Contact from '@src/components/Contact';
import Footer from '@src/components/Footer';
import Head from '@src/components/Head';
import Navbar from '@src/components/Navbar';
import Separator from '@src/components/Separator';
import Topbar from '@src/components/Topbar';

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
}));

export default function Layout(props) {
  const classes = useStyles();
  const { children } = props;

  // console.group('Layout.js');
  // console.log({ props });
  // console.groupEnd();

  return (
    <>
      <Head {...props} />
      <CssBaseline />
      <Container>
        <div className={classes.toolbar} />
        <Topbar {...props} />
        {children}
        <Separator />
        <Contact {...props} />
        <Separator />
        <Footer {...props} />
        <div className={classes.toolbar} />
      </Container>
      <Navbar {...props} />
    </>
  );
}
