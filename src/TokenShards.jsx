/* eslint-env es2020, browser */
import React from "react";
import shardsImg from "./assets/token-shards.png";

/** Görseldeki parçalara karşılık gelen renkler (güncel) */
export const ALLOCATION_COLORS = {
  "Public Sale":                "#C9A24B", // altın sarısı
  "Liquidity ( CEX&DEX )":      "#2FA84F", // zümrüt yeşili
  "Ecosystem & Partnerships":   "#8B5E34", // toprak rengi
  "Community Rewards":          "#7E1F1B", // koyu kırmızı
  "Treasury":                   "#595959", // koyu taş grisi
  "Team & Advisors":            "#D94A3F", // açık/parlak kırmızı
};

const TokenShards = () => {
  return (
    <div className="shards-wrap" aria-label="Token allocation shards image">
      <img src={shardsImg} alt="Crownless token shards" className="shards-img" />
    </div>
  );
};

export default TokenShards;
