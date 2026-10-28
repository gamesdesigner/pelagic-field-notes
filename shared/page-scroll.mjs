/** Reset the app scrollport, falling back to document scrolling in other hosts.
 * @param {Pick<HTMLElement, 'scrollTo'> | null} page
 * @param {Pick<Window, 'scrollTo'>} viewport
 */
export function scrollPageToStart(page = document.querySelector('.app-scroll-root'), viewport = window) {
  (page || viewport).scrollTo({top:0, left:0, behavior:'instant'});
}
