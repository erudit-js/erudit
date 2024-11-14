export interface PreviousNext {
    next?: PreviousNextItem;
    previous?: PreviousNextItem;
}

export interface PreviousNextItem {
    title: string;
    link: string;
}
