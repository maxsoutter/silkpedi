/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Delivery, pricing and returns. Only states what the team actually honours:
 * replacement of damaged or wrong kits, no returns on opened kits. If delivery
 * prices or member pricing change, change data.ts / membership.ts and this page
 * together.
 */

import React from "react";
import PolicyLayout, { PolicySection } from "./PolicyLayout";
import { WHATSAPP_PHONE, WHATSAPP_DISPLAY } from "../OrderFlow";
import { PRODUCT_BUNDLES } from "../data";
import { MEMBER_DISCOUNT_PCT } from "../membership";

const wa = `https://wa.me/${WHATSAPP_PHONE}`;

export default function DeliveryReturns() {
  return (
    <PolicyLayout
      title="Delivery & Returns"
      updated="5 October 2026"
      intro="How ordering, pricing, delivery and returns work at Silkpedi."
    >
      <PolicySection title="How ordering works">
        <p>
          Choose your pack on our site, then confirm your order with us on WhatsApp. We'll agree your delivery
          address, delivery time and payment with you there. Your order is confirmed once we've agreed those
          details on WhatsApp.
        </p>
      </PolicySection>

      <PolicySection title="Prices">
        <p>
          Members get {MEMBER_DISCOUNT_PCT}% off our regular prices. Becoming a member is free: just leave your
          WhatsApp number in the discount pop-up on our site.
        </p>
        <ul>
          {PRODUCT_BUNDLES.map((b) => (
            <li key={b.id}>
              <strong>{b.name}:</strong> ${b.originalPrice} regular, ${b.price} member price
            </li>
          ))}
        </ul>
        <p>All prices are in US dollars.</p>
      </PolicySection>

      <PolicySection title="Delivery">
        <ul>
          <li>
            <strong>Harare CBD:</strong> free on the 2-pack and 3-pack, and a flat $5 on a single pack.
          </li>
          <li>
            <strong>Elsewhere in Zimbabwe, South Africa, Zambia and beyond:</strong> message us on WhatsApp and
            we'll arrange delivery and confirm the cost with you before you pay.
          </li>
        </ul>
        <p>We'll confirm your delivery time with you on WhatsApp when we confirm your order.</p>
      </PolicySection>

      <PolicySection title="Damaged or wrong items">
        <p>
          If your kit arrives damaged, or we've sent you the wrong item, <strong>we'll replace it free of
          charge</strong>. Send us a WhatsApp message with a photo within 7 days of delivery, and include your
          order reference if you have it.
        </p>
      </PolicySection>

      <PolicySection title="Returns">
        <p>
          For hygiene reasons, we can't accept returns of kits that have been opened or used. If you have a
          problem with an unopened kit, message us on WhatsApp and we'll do our best to help.
        </p>
      </PolicySection>

      <PolicySection title="Using Silkpedi safely">
        <p>
          Silkpedi is a cosmetic foot peel, not a medical treatment. Don't use it on open cracks, wounds or
          infected skin. If you have diabetes, poor circulation or any foot condition, speak to your doctor
          first. Not for use during pregnancy or breastfeeding. Please read the instructions in your pack before
          you start.
        </p>
      </PolicySection>

      <PolicySection title="Questions">
        <p>
          WhatsApp us at{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="font-bold text-purple-brand underline">
            {WHATSAPP_DISPLAY}
          </a>
          . A real person answers.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
