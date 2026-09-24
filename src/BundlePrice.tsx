/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Check, Gift, Lock } from "lucide-react";
import { ProductBundle } from "./types";
import { openMemberPopup, priceFor } from "./membership";

/**
 * Price box + savings strip for a bundle card, shared by the homepage and the
 * ad landing pages so member pricing reads the same everywhere.
 *
 * Members see the member price with the regular price struck through.
 * Non-members see the regular price they'd actually pay, plus a button that
 * opens the discount pop-up.
 */
export default function BundlePrice({ bundle, isMember }: { bundle: ProductBundle; isMember: boolean }) {
  return (
    <>
      <div
        className={`text-center py-5 rounded-2xl border ${
          bundle.popular ? "bg-purple-light border-purple-brand/10" : "bg-teal-dark/30 border-teal-light/20"
        }`}
      >
        <div className="flex items-baseline justify-center space-x-2">
          <span className="text-5xl font-black tracking-tight">${priceFor(bundle, isMember)}</span>
          {isMember && (
            <span className="text-lg line-through text-gray-400 font-bold">${bundle.originalPrice}</span>
          )}
        </div>
        <p className="text-[10px] font-mono font-bold uppercase mt-1 tracking-widest">
          {isMember ? `Member price · ${bundle.description}` : bundle.description}
        </p>
      </div>

      {isMember ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl p-3 text-center text-xs font-black">
          🎉 MEMBER PRICE: YOU SAVE ${bundle.savings}
        </div>
      ) : (
        <button
          type="button"
          onClick={openMemberPopup}
          className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-xl p-3 text-center text-xs font-black hover:bg-emerald-500/20 transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>UNLOCK MEMBER PRICE ${bundle.price} (SAVE ${bundle.savings})</span>
        </button>
      )}
    </>
  );
}

/** "What's in the kit" rows, with the free bonuses picked out. */
export function BundleItems({ bundle }: { bundle: ProductBundle }) {
  const muted = bundle.popular ? "text-gray-600" : "text-gray-200";
  return (
    <>
      {bundle.itemsIncluded.map((item, i) => {
        const isBonus = item.startsWith("FREE BONUS:");
        return (
          <div key={i} className="flex items-start space-x-2.5 text-xs font-medium">
            {isBonus ? (
              <Gift className="w-4.5 h-4.5 text-purple-brand flex-shrink-0 mt-0.5" />
            ) : (
              <Check className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0 mt-0.5" />
            )}
            <span className={muted}>
              {isBonus ? (
                <>
                  <span className="font-black text-purple-brand">FREE BONUS:</span>
                  {item.slice("FREE BONUS:".length)}
                </>
              ) : (
                item
              )}
            </span>
          </div>
        );
      })}
    </>
  );
}
