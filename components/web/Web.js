// // @flow
// import * as React from 'react';
// import { View, findNodeHandle } from 'react-native';
// import withTheme, { type Theme } from '../core/withTheme';
// import { createFragmentContainer, graphql } from 'react-relay';
// import * as generated from './__generated__/Web.graphql';
// // import PageTitle from './PageTitle';
// import Head from 'next/head';
//
// export const getFocusableNodes = (instance: Object): Array<HTMLElement> => {
//   const node = findNodeHandle(instance);
//   // TODO: React Native
//   if (node == null || typeof node === 'number') return [];
//   if (typeof node.querySelectorAll !== 'function') return [];
//   return [...node.querySelectorAll('[data-focusable="true"]')];
// };
//
// // Tohle fakt patri jinam.
// export const editThrottle = 1000;
//
// type PageProps = {|
//   theme: Theme,
//   data: generated.Page,
// |};
//
// class Page extends React.PureComponent<PageProps> {
//   componentDidMount() {
//     const node = getFocusableNodes(this)[1];
//     if (node) node.focus();
//   }
//
//   render() {
//     const {
//       theme,
//       data: { page },
//     } = this.props;
//     if (page == null) return null;
//     return (
//       <>
//         <Head>
//           <title>{page.title}</title>
//         </Head>
//         <View style={theme.styles.page}>
//           <PageTitle pageId={page.id} defaultValue={page.title} />
//           <PageMarkdown />
//         </View>
//       </>
//     );
//   }
// }
//
// export default createFragmentContainer(
//   withTheme(Page),
//   graphql`
//     fragment Page on Query @argumentDefinitions(id: { type: "ID!" }) {
//       page(id: $id) {
//         id
//         title
//       }
//     }
//   `,
// );
