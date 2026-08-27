export default function GuideMenusMedia() {
  return (
    <div>
      <h2>8. Update a menu</h2>
                  <ol>
                    <li>Open <strong>Site menus</strong>.</li>
                    <li>Choose <strong>Main menu</strong>, <strong>Top header</strong>, or <strong>Footer</strong> so you know which location you are editing.</li>
                    <li>
                      Add an item by <strong>picking a page</strong> from the list. The URL is filled automatically
                      and is the same in every language — you do not type slugs for Français, Ikinyarwanda, or Deutsch.
                    </li>
                    <li>
                      Switch language tabs to check labels. Automatic translations come from{' '}
                      <strong>Translations</strong>. Type a label only to correct a mistake.
                    </li>
                    <li>Use <strong>Custom URL</strong> only for a page that is not in the list, or an external link.</li>
                    <li>Drag to reorder, then save menus and refresh the public site.</li>
                  </ol>
                  <p>
                    Do not create a different path per language (for example <code>/fr/apparitions</code>). Visitors
                    switch language; the address stays <code>/our-lady/apparitions</code>.
                  </p>

                  <h2>9. Replace images and upload documents</h2>
                  <ol>
                    <li>Open <strong>Gallery / Media</strong>.</li>
                    <li>Upload JPG/PNG/WebP for images or PDF for documents (reports, leaflets).</li>
                    <li>
                      Open the <strong>Public gallery</strong> tab to choose which photos appear on{' '}
                      <code>/gallery</code>. Add from the library or upload a new file. Removing an image there
                      only hides it — the file stays until you delete it on <strong>Site images</strong>.
                    </li>
                    <li>
                      On <strong>Site images</strong>, you will see every photo. Removing a file there deletes it
                      permanently after a list of pages that still use it — replace those first.
                    </li>
                    <li>
                      On a page, news item, or directory entry, choose the uploaded file as the featured or block
                      image—or link the PDF from page content / Annual Reports.
                    </li>
                    <li>Save the content record.</li>
                  </ol>
                  <p>
                    Prefer reasonably sized images (large enough for retina screens, not multi‑megabyte camera
                    originals) for faster loading on mobile networks.
                  </p>
    </div>
  )
}
