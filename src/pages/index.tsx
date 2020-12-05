import React from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import axios from "axios";

const INITIAL_ATTEMPTS = 10;

export default function Home() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [results, setResults] = React.useState("");

  const identifyImage = React.useCallback(
    async (imageUrl, attempts = INITIAL_ATTEMPTS) => {
      if (attempts < 0) {
        setError(`${INITIAL_ATTEMPTS} attempts failed`);
        setLoading(false);
        return;
      }
      try {
        setResults("");
        setError("");
        setLoading(true);
        const response = await axios.post(`/api/identify`, {
          imageUrl,
        });
        setLoading(false);
        return response.data.results;
      } catch (error) {
        return identifyImage(imageUrl, attempts - 1);
      }
    },
    []
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Rubber duck or a bunch of rocks?</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a
            href="/static/images/duck.jpg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rubber duck
          </a>{" "}
          or a <br />
          <a
            href="/static/images/rock.jpg"
            target="_blank"
            rel="noopener noreferrer"
          >
            bunch of rocks
          </a>
          ?
        </h1>

        <p className={styles.description}>
          Check out the{" "}
          <a
            href="https://www.npmjs.com/package/tfjs-node-lambda"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code className={styles.code}>tfjs-node-lambda</code>
          </a>{" "}
          npm package.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            identifyImage(imageUrl).then((results) => setResults(results));
          }}
          className={styles.card}
        >
          <input
            type="text"
            placeholder="Image URL"
            onChange={(event) => setImageUrl(event.target.value)}
            value={imageUrl}
          />
          <button type="submit">Identify</button>
        </form>
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            style={{ width: "200px", height: "200px", objectFit: "contain" }}
          />
        )}
        {results && (
          <div className={styles.card}>
            <p className={styles.description}>
              {results["rubber-duck"] > results["rock"]
                ? "Rubber duck"
                : "Rock"}
            </p>
            <pre>{JSON.stringify(results, null, 2)}</pre>
          </div>
        )}
        {loading && <div className={styles.card}>Loading…</div>}
        {error && <div className={styles.card}>{error}</div>}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.npmjs.com/package/tfjs-node-lambda"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <strong style={{ paddingLeft: "4px" }}>Taco 🌮 Tuesday</strong>
        </a>
      </footer>
    </div>
  );
}
