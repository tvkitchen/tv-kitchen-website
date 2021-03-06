import React from 'react';
import _ from 'lodash';
import { Helmet } from 'react-helmet';
import { Link as GatsbyLink } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql } from 'gatsby';

import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Copy from '@src/components/Copy';
import Layout from '@src/components/Layout';
import Separator from '@src/components/Separator';
import config from '@src/config';
import withTheme from '@src/themes/withTheme';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  head: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(6),
    },
  },
  title: {
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      marginBottom: theme.spacing(6),
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  content: {
    marginBottom: theme.spacing(4),
  },
  selectedListItem: {
    background: `${theme.palette.background.default} !important`,
  },
  paginationButtons: {
    color: theme.palette.primary.main,
  },
  desktopMenu: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
    },
  },
  mobileMenuToggle: {
    borderRadius: 100,
    bottom: theme.spacing(10),
    display: 'block',
    height: theme.spacing(8),
    position: 'fixed',
    lineHeight: '1em',
    right: theme.spacing(2),
    width: theme.spacing(8),
    zIndex: theme.zIndex.appBar,
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  mobileMenu: {
    flexShrink: 0,
  },
  drawerHead: {
    padding: theme.spacing(2, 1, 0, 2),
  },
  drawerPaper: {
    // minWidth: '300px',
  },
}));

const DocsMenu = ({ chapters, section, loosePages, rootPage, uri, ...props }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(section || null);

  const listItemProps = {
    button: true,
    classes: { selected: classes.selectedListItem },
  };
  const listItemTextProps = {
    primaryTypographyProps: { color: 'primary', noWrap: true, variant: 'h6' },
  };

  return (
    <List dense>
      <ListItem {...listItemProps} component={GatsbyLink} selected={'/docs' === uri} to={`/${rootPage.node.slug}`}>
        <ListItemText {...listItemTextProps} primary={rootPage.node.frontmatter.title} />
      </ListItem>
      {loosePages.map(page => {
        return (
          <ListItem
            {...listItemProps}
            button
            component={GatsbyLink}
            to={`/${page.node.slug}`}
            key={page.node.id}
            selected={uri === `/${page.node.slug}`}>
            <ListItemText {...listItemTextProps} primary={page.node.frontmatter.title} />
          </ListItem>
        );
      })}
      {_.orderBy(Object.keys(chapters, val => val)).map((key, i) => {
        if (key === 'null') return null;
        const chapterPages = chapters[key];
        const list = (
          <List component="div" dense disablePadding key={key}>
            {chapterPages.map(({ node }) => {
              const { frontmatter, id, slug } = node;
              const { title } = frontmatter;
              if ('/doc/'.includes(slug)) return null;
              return (
                <ListItem
                  {...listItemProps}
                  component={GatsbyLink}
                  className={classes.nested}
                  key={id}
                  to={`/${slug}`}
                  selected={uri === `/${slug}`}>
                  <ListItemText {...listItemTextProps} inset={false} primary={title} />
                </ListItem>
              );
            })}
          </List>
        );
        return [
          <ListItem
            button
            key={`${key}x`}
            onClick={() =>
              setOpen(prevState => {
                return prevState === key ? null : key;
              })
            }>
            <ListItemText {...listItemTextProps} primary={`${key}`} />
            {open === key ? <ExpandLess /> : <ExpandMore />}
          </ListItem>,
          <Collapse in={open === key} timeout="auto" unmountOnExit key={`${key}y`}>
            {list}
          </Collapse>,
        ];
      })}
    </List>
  );
};

const DocsTpl = ({
  data: {
    mdx: { body, frontmatter },
    allMdx,
  },
  ...props
}) => {
  const classes = useStyles();
  const [drawer, setDrawer] = React.useState(false);

  const rootPagePath = 'content/docs/index.mdx';
  const chapters = _.groupBy(allMdx.edges, ({ node }) => node.frontmatter.section);
  const loosePages = _.filter(chapters.null, ({ node }) => !node.fileAbsolutePath.endsWith(rootPagePath));
  const rootPage = _.find(allMdx.edges, ({ node }) => node.fileAbsolutePath.endsWith(rootPagePath));
  const chaptersArr = _.sortBy(
    _.filter(allMdx.edges, o => o.node.frontmatter.section !== null),
    ({ node }) => node.frontmatter.section
  );
  const allDocsPages = [rootPage, ...loosePages, ...chaptersArr];
  const currentPageI = _.findIndex(allDocsPages, o => o.node.id === props.pageContext.id);
  const nextPageI = currentPageI < allDocsPages.length ? currentPageI + 1 : null;
  const prevPageI = currentPageI > 0 ? currentPageI - 1 : null;
  const nextPage = allDocsPages[nextPageI] || null;
  const prevPage = allDocsPages[prevPageI] || null;

  console.group('DocsTpl.js');
  // console.log({ props });
  // console.log({ loosePages });
  // console.log({ chapters });
  // console.log({ allDocsPages });
  // console.log({ currentPageI });
  // console.log({ prevPage });
  // console.log({ nextPage });
  console.groupEnd();

  return (
    <Layout {...props}>
      <Helmet>
        <title>{`${config.sections.docs.title}: ${frontmatter.title}`}</title>
      </Helmet>
      <main>
        <Container disableGutters>
          <Grid container spacing={8}>
            <Grid item xs={12} md={4} className={classes.desktopMenu}>
              <DocsMenu
                chapters={chapters}
                loosePages={loosePages}
                rootPage={rootPage}
                section={frontmatter.section}
                uri={props.uri}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <div className={classes.content}>
                <Container disableGutters className={classes.head}>
                  <Typography className={classes.title} variant="h2" component="h1">
                    {frontmatter.title}
                  </Typography>
                </Container>
                <Copy>
                  <MDXRenderer>{body}</MDXRenderer>
                </Copy>
              </div>
              <Separator silent />
              <Grid container>
                <Grid item xs={6}>
                  <Button
                    className={classes.paginationButtons}
                    component={GatsbyLink}
                    disabled={!prevPage}
                    startIcon={<KeyboardArrowLeftIcon />}
                    to={prevPage ? `/${prevPage?.node.slug}` : null}>
                    Previous <Hidden xsDown>page</Hidden>
                  </Button>
                </Grid>
                <Grid item xs={6} align="right">
                  <Button
                    className={classes.paginationButtons}
                    component={GatsbyLink}
                    disabled={!nextPage}
                    endIcon={<KeyboardArrowRightIcon />}
                    to={nextPage ? `/${nextPage?.node.slug}` : null}>
                    Next <Hidden xsDown>page</Hidden>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </main>
      <Button className={classes.mobileMenuToggle} color="primary" onClick={() => setDrawer(true)} variant="contained">
        <MenuBookIcon />
      </Button>
      <SwipeableDrawer
        anchor="bottom"
        className={classes.mobileMenu}
        classes={{ paper: classes.drawerPaper }}
        onClose={() => setDrawer(false)}
        onOpen={() => setDrawer(true)}
        open={drawer}>
        <Grid
          alignContent="center"
          alignItems="center"
          className={classes.drawerHead}
          container
          justify="space-between">
          <Grid item>
            <Typography variant="h5" component="h2">
              Docs:
            </Typography>
          </Grid>
          <Grid item>
            <IconButton size="small" onClick={() => setDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <DocsMenu
          chapters={chapters}
          loosePages={loosePages}
          rootPage={rootPage}
          section={frontmatter.section}
          uri={props.uri}
        />
      </SwipeableDrawer>
    </Layout>
  );
};

export default withTheme(DocsTpl, config.sections.docs.color);

export const pageQuery = graphql`
  query DocsTplQuery($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        section
        title
      }
      body
    }
    allMdx(
      filter: { fileAbsolutePath: { regex: "content/docs/.*.mdx/" } }
      sort: { fields: [slug, frontmatter___score], order: [ASC, DESC] }
    ) {
      edges {
        node {
          id
          fileAbsolutePath
          slug
          frontmatter {
            score
            section
            title
          }
        }
      }
    }
  }
`;
