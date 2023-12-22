import React from "react";
import { Helmet } from "react-helmet";

const Test = () => {
  return (
    <html>
      <Helmet>
        <title>reCAPTCHA demo: Simple page</title>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </Helmet>
      <body>
        <form action="?" method="POST">
          <div className="g-recaptcha" data-sitekey="6LdV5DkpAAAAANMlYsbUdZsj-reC4K1mQwoU9pV1
"></div>
          <br />
          <input type="submit" value="Submit" />
        </form>
      </body>
    </html>
  );
};

export default Test;
