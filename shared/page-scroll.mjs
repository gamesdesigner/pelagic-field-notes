/** Reset native page scrolling after a navigation or unit change.
 * @param {Pick<Window, 'scrollTo'>} viewport
 */
export function scrollPageToStart(viewport = window) {
  viewport.scrollTo({top:0, left:0, behavior:'instant'});
}
