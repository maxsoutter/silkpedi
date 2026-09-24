/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSyncExternalStore } from "react";
import { ProductBundle } from "./types";

/**
 * Member pricing.
 *
 * Everyone who leaves their WhatsApp number in the discount pop-up becomes a
 * "member" and pays the member price (bundle.price). Anyone who doesn't pays the
 * regular price (bundle.originalPrice). The regular price has to be what a
 * non-member is genuinely charged on WhatsApp, or the discount isn't real.
 *
 * Membership lives in localStorage so it survives page changes and return
 * visits. Components subscribe through useMembership() and re-render the moment
 * someone joins, so every price on the page flips to the member price at once.
 */

export const REGULAR_SINGLE_PRICE = 33;
export const MEMBER_SINGLE_PRICE = 25;
export const MEMBER_DISCOUNT_PCT = Math.round(
  ((REGULAR_SINGLE_PRICE - MEMBER_SINGLE_PRICE) / REGULAR_SINGLE_PRICE) * 100
);

const MEMBER_KEY = "sp_member";
const DISMISSED_KEY = "sp_popup_dismissed";

type State = { isMember: boolean; popupOpen: boolean };

function readMember(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage.getItem(MEMBER_KEY);
  } catch {
    return false;
  }
}

let state: State = { isMember: readMember(), popupOpen: false };
const listeners = new Set<() => void>();

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useMembership() {
  return useSyncExternalStore(subscribe, () => state, () => state);
}

export function joinMembership() {
  try {
    window.localStorage.setItem(MEMBER_KEY, String(Date.now()));
  } catch {
    // Private mode: they still get the member price for this visit.
  }
  setState({ isMember: true });
}

export function openMemberPopup() {
  setState({ popupOpen: true });
}

export function closeMemberPopup() {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Worst case the pop-up shows again on the next page in this visit.
  }
  setState({ popupOpen: false });
}

/** True if the visitor already closed the pop-up during this visit. */
export function popupDismissedThisVisit(): boolean {
  try {
    return !!window.sessionStorage.getItem(DISMISSED_KEY);
  } catch {
    return false;
  }
}

/** What this visitor actually pays for a bundle. */
export function priceFor(bundle: ProductBundle, isMember: boolean): number {
  return isMember ? bundle.price : bundle.originalPrice;
}

/** Single-pack price for the "GET SILKPEDI – $X" buttons. */
export function singlePrice(isMember: boolean): number {
  return isMember ? MEMBER_SINGLE_PRICE : REGULAR_SINGLE_PRICE;
}
