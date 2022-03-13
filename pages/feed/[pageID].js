import router from "next/router";
import Toolbar from "../../components/toolbar";
import { useRouter } from "next/router";
import styles from "../../styles/Feed.module.css";

export const Feed = ({ pageNumber, articles }) => {
  const router = useRouter();
  console.log(articles);
  return (
    <>
      <div className="page-container">
        {/* Toolbar */}
        <Toolbar />

        {/* Home Page Content */}
        <div className={styles.main}>
          {articles.map((article, index) => {
            if (
              article.title &&
              article.description &&
              article.urlToImage &&
              article.url
            ) {
              return (
                <div key={index} className={styles.post}>
                  <h1 onClick={() => (window.location.href = article.url)}>
                    {article.title}
                  </h1>
                  <p>{article.description}</p>
                  {!!article.urlToImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={article.urlToImage} alt="news-image" />
                  )}
                </div>
              );
            }
          })}
        </div>
        <div className={styles.paginator}>
          <div
            className={pageNumber === 1 ? styles.disabled : styles.active}
            onClick={() => {
              if (pageNumber > 1) {
                router.push(`/feed/${pageNumber - 1}`);
              }
            }}
          >
            Previous Page
          </div>

          <div>#{pageNumber}</div>

          <div
            className={pageNumber === 5 ? styles.disabled : styles.active}
            onClick={() => {
              if (pageNumber < 5) {
                // As of the current version of Next.js the default behavior for router.push
                // will leave the scroll where it is, so we have to manually call scrollTo.
                // This however is being worked on and is fixed in canary.
                // Show this in tutorial vid:
                // https://github.com/vercel/next.js/issues/3249
                router
                  .push(`/feed/${pageNumber + 1}`)
                  .then(() => window.scrollTo(0, 0));
              }
            }}
          >
            Next Page
          </div>
        </div>
      </div>

      {/* Paginator */}
    </>
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
