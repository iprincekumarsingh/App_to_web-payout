import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

function onChange(value) {
  console.log("Captcha value:", value);
}

function Test() {
  return <ReCAPTCHA sitekey="your_recaptcha_site_key" onChange={onChange} />;
}

export default Test;
