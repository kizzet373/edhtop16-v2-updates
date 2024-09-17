/**
 * @generated SignedSource<<c7d93d6ea51956a0dbb45374f8347835>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type v2_TopCommandersCard$data = {
  readonly colorId: string;
  readonly conversionRate: number;
  readonly imageUrls: ReadonlyArray<string>;
  readonly name: string;
  readonly topCuts: number;
  readonly " $fragmentType": "v2_TopCommandersCard";
};
export type v2_TopCommandersCard$key = {
  readonly " $data"?: v2_TopCommandersCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"v2_TopCommandersCard">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "timePeriod",
        "variableName": "timePeriod"
      }
    ],
    "kind": "ObjectValue",
    "name": "filters"
  }
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "timePeriod"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "v2_TopCommandersCard",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "colorId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imageUrls",
      "storageKey": null
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "conversionRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "topCuts",
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "92b214bde493d4024b7a67dfce44ac8e";

export default node;