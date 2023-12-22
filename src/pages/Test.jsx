import React from "react";
import ReCAPTCHA from "react-google-recaptcha";

function onChange(value) {
  console.log("Captcha value:", value);
}

function Test() {
  return <ReCAPTCHA sitekey="6LdV5DkpAAAAANMlYsbUdZsj-reC4K1mQwoU9pV1" onChange={onChange} />;
}

export default Test;
