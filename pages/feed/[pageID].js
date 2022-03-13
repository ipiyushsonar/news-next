import { useState, useEffect } from 'react';
import Head from 'next/head';

import Link from 'next/link';
import router, { useRouter } from 'next/router';
import Toolbar from '../../components/toolbar';
import styles from '../../styles/Feed.module.css';

import netlifyAuth from '../../netlifyAuth.js';

export const Feed = ({ pageNumber, articles }) => {
  const router = useRouter();
  
  let [loggedIn, setLoggedIn] = useState(netlifyAuth.isAuthenticated);
  let [ user, setUser ] = useState( null );
  
  // console.log( articles );
  useEffect(() => {
		let isCurrent = true;
		netlifyAuth.initialize((user) => {
			if (isCurrent) {
				setLoggedIn(!!user);
				setUser(user);
			}
		});

		return () => {
			isCurrent = false;
		};
	}, []);

	return (
		<div className='page-container'>
			<Head>
				<title>Feed | ShuttleX</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
      <Toolbar />
      
      { loggedIn ? (
        <>
          <div className={ styles.main }>
            { articles.map( ( article, index ) => {
              if ( article.title &&
                article.description &&
                article.urlToImage &&
                article.url ) {
                return (
                  <div key={ index } className={ styles.post }>
                    <h1 onClick={ () => ( window.location.href = article.url ) }>
                      { article.title }
                    </h1>
                    <p>{ article.description }</p>
                    { !!article.urlToImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ article.urlToImage } alt='news-image' />
                    ) }
                  </div>
                );
              }
            } ) }
          </div>
          <div className={ styles.paginator }>
            <div
              className={ pageNumber === 1 ? styles.disabled : styles.active }
              onClick={ () => {
                if ( pageNumber > 1 ) {
                  router.push( `/feed/${ pageNumber - 1 }` );
                }
              } }
            >
              Previous Page
            </div>

            <div>#{ pageNumber }</div>

            <div
              className={ pageNumber === 5 ? styles.disabled : styles.active }
              onClick={ () => {
                if ( pageNumber < 5 ) {
                  // As of the current version of Next.js the default behavior for router.push
                  // will leave the scroll where it is, so we have to manually call scrollTo.
                  // This however is being worked on and is fixed in canary.
                  // Show this in tutorial vid:
                  // https://github.com/vercel/next.js/issues/3249
                  router
                    .push( `/feed/${ pageNumber + 1 }` )
                    .then( () => window.scrollTo( 0, 0 ) );
                }
              } }
            >
              Next Page
            </div>
          </div>
        </>
      ) : (
        <main>
          <p>YOU ARE NOT ALLOWED HERE.</p>
          <Link href="/">
            <a>Go back to the grody public space.</a>
          </Link>
        </main>
      )}
		</div>
	);
};

export const getServerSideProps = async (pageContext) => {
	// Getting page number
	const pageNumber = pageContext.query.pageID;

	//   Checking if page number exists and limits
	if (!pageNumber || pageNumber < 1 || pageNumber > 5) {
		return {
			props: {
				articles: [],
				pageNumber: 1,
			},
		};
	}

	// Fetching Data
	const apiResponse = await fetch(
		`https://newsapi.org/v2/top-headlines?country=in&pageSize=8&page=${pageNumber}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.NEWS_API}`,
			},
		}
	);

	//   const api
	const newsData = await apiResponse.json();

	//   Destructuring Received Data
	const { articles } = newsData;

	//   Return
	return {
		props: {
			articles: articles,
			pageNumber: Number.parseInt(pageNumber),
		},
	};
};

export default Feed;
