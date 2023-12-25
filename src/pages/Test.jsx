import React from "react";

import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";
function onChange(value) {
  console.log("Captcha value:", value);
}

function Test() {
  const handleVerify = (token) => {
    console.log(token);
  };
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LfW7DkpAAAAANhD7WCELgzxYFjtvTZeikjSq8cp">
      <GoogleReCaptcha onVerify={handleVerify} />
    </GoogleReCaptchaProvider>
  );
}

export default Test;
