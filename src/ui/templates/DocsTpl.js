import React, { useState } from 'react';
import _ from 'lodash';
import { Helmet } from 'react-helmet';
import { Link as GatsbyLink } from 'gatsby';
import { StaticQuery, graphql } from 'gatsby';

import Collapse from '@material-ui/core/Collapse';
import Container from '@material-ui/core/Container';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';

import Copy from '@ui/components/Copy';
import Layout from '@ui/components/Layout';
import sections from '@ui/config/sections';
import withTheme from '@ui/themes/withTheme';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const DocsTpl = ({ _frontmatter, children, ...props }) => {
  const classes = useStyles();

  const [open, setOpen] = useState(_frontmatter.section || null);

  console.group('DocsTpl.js');
  console.log({ _frontmatter });
  console.log({ children });
  console.log({ props });
  console.groupEnd();

  return (
    <StaticQuery
      query={graphql`
        query DocsTplQuery {
          allSitePage(filter: { path: { regex: "/docs/" } }) {
            edges {
              node {
                id
                path
                componentPath
                context {
                  frontmatter {
                    score
                    section
                    title
                  }
                }
              }
            }
          }
        }
      `}
      render={data => {
        const {
          allSitePage: { edges: pages },
        } = data;

        const order = array => {
          return _.orderBy(
            array,
            [({ node: { context } }) => context.frontmatter.score || 0, ({ node: { context } }) => context.path],
            ['desc', 'asc']
          );
        };

        const rootPagePath = 'pages/docs/index.mdx';
        const chapters = _.groupBy(pages, ({ node }) => node.context.frontmatter.section);
        const loosePages = order(_.filter(chapters.null, ({ node }) => !node.componentPath.endsWith(rootPagePath)));
        const rootPage = _.find(pages, ({ node }) => node.componentPath.endsWith(rootPagePath));

        // console.group('DocsTpl');
        // console.log({ props });
        // console.log({ pageContext });
        // console.log({ loosePages });
        // console.log({ loosePages });
        // console.log(order(loosePages));
        // console.log({ rootPage });
        // console.groupEnd();

        return (
          <Layout {...props}>
            <Helmet>
              <title>{`${_.find(sections, o => o.id === 'docs')?.title}: ${_frontmatter.title}`}</title>
            </Helmet>
            <div className={classes.root}>
              <Container component="main" maxWidth="md">
                <Grid container spacing={4} wrap="nowrap">
                  <Grid item xs={4}>
                    <List>
                      <ListItem button component={GatsbyLink} to={rootPage.node.path}>
                        <ListItemText primary={rootPage.node.context.frontmatter.title} />
                      </ListItem>
                      {loosePages.map(page => {
                        return (
                          <ListItem button component={GatsbyLink} to={page.node.path} key={page.node.path}>
                            <ListItemText primary={page.node.context.frontmatter.title} />
                          </ListItem>
                        );
                      })}
                      {Object.keys(chapters).map((section, i) => {
                        if (section === 'null') return null;
                        const chapterPages = order(chapters[section]);
                        const list = (
                          <List component="div" disablePadding key={`z${i}`}>
                            {chapterPages.map(({ node }) => {
                              const { frontmatter } = node.context;
                              if (node.path === '/docs/') return null;
                              return (
                                <ListItem
                                  className={classes.nested}
                                  button
                                  component={GatsbyLink}
                                  key={node.path}
                                  to={node.path}>
                                  <ListItemText
                                    inset={false}
                                    primary={frontmatter.title}
                                    primaryTypographyProps={{
                                      variant: 'body2',
                                      noWrap: true,
                                    }}
                                  />
                                </ListItem>
                              );
                            })}
                          </List>
                        );
                        return [
                          <ListItem
                            button
                            key={`x${i}`}
                            onClick={() =>
                              setOpen(prevState => {
                                return prevState === section ? null : section;
                              })
                            }>
                            <ListItemText primary={section} />
                            {open === section ? <ExpandLess /> : <ExpandMore />}
                          </ListItem>,
                          <Collapse in={open === section} timeout="auto" unmountOnExit key={`y${i}`}>
                            {list}
                          </Collapse>,
                        ];
                      })}
                    </List>
                  </Grid>
                  <Grid item xs={8}>
                    <Copy>{children}</Copy>
                  </Grid>
                </Grid>
              </Container>
            </div>
          </Layout>
        );
      }}
    />
  );
};

export default withTheme(DocsTpl, sections.docs.color);
