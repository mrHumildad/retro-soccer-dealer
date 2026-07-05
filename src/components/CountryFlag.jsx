import React from "react";
import ReactCountryFlag from "react-country-flag";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export default function CountryFlag({
  country,
  size = "1.5em",
  title = true,
}) {
  if (!country) return null;

  const code = countries.getAlpha2Code(country, "en");

  if (!code) {
    return <span>🏳️</span>;
  }

  return (
    <ReactCountryFlag
      countryCode={code}
      svg
      style={{
        width: size,
        height: size,
      }}
      title={title ? country : undefined}
    />
  );
}