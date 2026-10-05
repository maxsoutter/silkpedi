/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Privacy policy. Written in plain English to match what the site actually
 * does — if the pop-up, order form, storage or tracking changes, update this
 * page in the same commit. Contact is WhatsApp only (Max's choice).
 */

import React from "react";
import PolicyLayout, { PolicySection } from "./PolicyLayout";
import { WHATSAPP_PHONE, WHATSAPP_DISPLAY } from "../OrderFlow";

const wa = `https://wa.me/${WHATSAPP_PHONE}`;

export default function Privacy() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      updated="5 October 2026"
      intro="This explains what personal information Silkpedi collects, why we collect it, who we share it with, and how you can see, change or delete it."
    >
      <PolicySection title="Who we are">
        <p>
          Silkpedi sells an at-home exfoliating foot peel through silkpedi.com and WhatsApp. We serve
          customers in Zimbabwe, South Africa, Zambia and beyond. Silkpedi is responsible for the personal
          information described on this page.
        </p>
        <p>
          You can reach us about anything on this page on WhatsApp at{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="font-bold text-purple-brand underline">
            {WHATSAPP_DISPLAY}
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="What we collect">
        <ul>
          <li>
            <strong>When you claim the member discount:</strong> your WhatsApp number, your email address if you
            choose to give it, and which page of our site you were on.
          </li>
          <li>
            <strong>When you start an order:</strong> your name, WhatsApp number, email address (optional), the
            pack you chose and a short order reference.
          </li>
          <li>
            <strong>When you message us on WhatsApp:</strong> your messages and the details you send us to
            complete your order, such as your delivery address.
          </li>
          <li>
            <strong>If you pay online:</strong> your payment is handled by the payment provider. We see that the
            payment went through and how much it was for. We never see or store your card details.
          </li>
        </ul>
        <p>We don't ask for any information about your health, and we don't need it.</p>
      </PolicySection>

      <PolicySection title="Why we use it">
        <ul>
          <li>To take, confirm and deliver your order, and to answer your questions.</li>
          <li>To follow up if you start an order and don't finish it.</li>
          <li>To give you the member price and the free Soft Feet Guide you signed up for.</li>
          <li>
            To send you Silkpedi offers and reminders, such as when it's time for your next treatment. You can
            stop these at any time by telling us on WhatsApp.
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Who we share it with">
        <p>
          <strong>We never sell your information.</strong> We only share it with the services we need to run the
          shop:
        </p>
        <ul>
          <li>
            <strong>Netlify</strong>, which hosts this website and stores the details you enter in our forms.
          </li>
          <li>
            <strong>WhatsApp</strong> (owned by Meta), where we confirm orders and talk to customers.
          </li>
          <li>
            <strong>Our courier</strong>, who receives your name, number and delivery address so they can deliver
            your order.
          </li>
          <li>
            <strong>Meta (Facebook and Instagram)</strong>, if we turn on advertising measurement. See "Cookies and
            tracking" below.
          </li>
        </ul>
        <p>
          Some of these services store information on servers outside Zimbabwe, including in the United States.
          We only use well-known providers that protect the data they hold.
        </p>
      </PolicySection>

      <PolicySection title="Cookies and tracking">
        <p>
          Our site saves two small notes in your own browser: one remembers that you've unlocked the member price,
          and one stops the discount pop-up from showing again during the same visit. They don't identify you and
          they never leave your device. You can clear them at any time by clearing your browser's site data.
        </p>
        <p>
          We may use the Meta Pixel to measure how well our Facebook and Instagram ads work, for example to count
          how many people who saw an ad later visited our site or bought. Meta handles that information under its
          own privacy policy, and you can control ad tracking in your Facebook and Instagram settings.
        </p>
      </PolicySection>

      <PolicySection title="How long we keep it">
        <p>
          We keep your details for as long as we need them to handle your orders and send you offers you've signed
          up for. If you ask us to delete them, we will, unless we need to keep a record of a sale for tax or
          accounting reasons.
        </p>
      </PolicySection>

      <PolicySection title="Your rights">
        <p>
          Under Zimbabwe's Cyber and Data Protection Act, and South Africa's Protection of Personal Information
          Act if you're in South Africa, you can ask us to:
        </p>
        <ul>
          <li>tell you what personal information we hold about you,</li>
          <li>correct anything that's wrong,</li>
          <li>delete your information, or</li>
          <li>stop sending you offers.</li>
        </ul>
        <p>
          Just send us a WhatsApp message at{" "}
          <a href={wa} target="_blank" rel="noopener noreferrer" className="font-bold text-purple-brand underline">
            {WHATSAPP_DISPLAY}
          </a>{" "}
          and we'll take care of it. If you're unhappy with how we've handled your information, you can also
          complain to POTRAZ, Zimbabwe's data protection authority, or to the Information Regulator in South
          Africa.
        </p>
      </PolicySection>

      <PolicySection title="Children">
        <p>Our shop is for adults. We don't knowingly collect information from anyone under 18.</p>
      </PolicySection>

      <PolicySection title="Changes to this policy">
        <p>
          If we change how we use your information, we'll update this page and the date at the top.
        </p>
      </PolicySection>
    </PolicyLayout>
  );
}
