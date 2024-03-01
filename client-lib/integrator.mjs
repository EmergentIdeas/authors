import sortable from 'sortablejs'
if (!sortable.create && sortable.default) {
	sortable = sortable.default
}


/**
 * Expects markup in the form of:
 * <div class="ei-editable-sortable-tiles">
 * 		<ul class="tiles" data-sort-url="/admin/hierarchies/sort">
 * 			<li class="tile" data-id="e0e5e574-4709-48d9-8df1-167af79f4b1e"> <!-- Where the value of data-id is database identifier of the object represented by the tile -->
 * 				<!-- Some markup here which displays the information about the tile -->
 * 			</li>
 * 		</ul>
 * </div>
 * 
 * 
 */

export default function integrate() {

	let tiles = document.querySelector('.ei-editable-sortable-tiles.author-tiles .tiles')
	if (tiles) {
		let dd = sortable.create(tiles, {
			handle: '.move',
			onSort: function (evt) {
				var count = 0;
				var order = {}
				let lis = evt.target.querySelectorAll('li')
				for (let li of lis) {
					order[li.getAttribute('data-id')] = count++
				}
				let url = evt.target.getAttribute('data-sort-url')
				fetch(url, {
					method: "POST", // *GET, POST, PUT, DELETE, etc.
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(order) // body data type must match "Content-Type" header
				})
			}
		})
	}
}