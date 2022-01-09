// In Recoil we need atom for seperate thing to store for eg. userAtom to store detail globally in recoil store
// it is just like Slice from Redux

import { atom } from "recoil";

export const modalState = atom({
    key: 'modalState', // unique key
    default: false, // default state
})
