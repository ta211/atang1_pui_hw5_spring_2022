# pui-s22-FoodStory
A subscription and purchase website for health foods.

## Home / Products Overview Page
The home page also functions as a product overview page. It has a minimalist design that displays the top 3 items for each food category, and the users can view more items by clicking on the left and right arrows.
The user could access the product detail pages by clicking on the product images or titles.

## Login Page 
This page can be accessed by clicking on the top-right navigation bar. If you haven't logged in before, the action will bring you to the Login page. 
Currently, since we are using a static website, your username and password will not be recorded for information security.
After logging in, you will be redirected to the Account page.

## Account Page
This page can be accessed by clicking on the top-right navigation bar. If you have already logged in, the action will bring you to the Account page. 
You can view your upcoming subscriptions and all subscriptions on the Dashboard, or change account settings. (This features are not implemented yet for this stage.)
You can also log out on this page. This action will redirect you to the Login page, and you would have to log in again to access your account.

## Product Detail Pages
The product page displays the item image, item information (including title and description), and options that the user could select from. 
In the example (drink-1.html) case, the options are flavors.
Users could also select quantity and delivery span before they add the item to their cart.
After adding an item to cart, the cart drawer will unfold, with the newly added item glowing for 3 seconds. 

## Cart Drawer
The cart drawer is a preview of the Cart page that slides out of the right of the page and takes up 40% width of the page after unfolding. 
The drawer unfolds when the user clicks on the cart icon on the top right of the page, or when the user adds new items to the cart. In the later case, the drawer will automatically scroll to the newly added item, and a glowing effect will stay for 3 seconds to remind the user what they just added.
The drawer contains exactly the same contents as the Cart page, allowing the same actions like removing or changing properties. Users can click the "expand" link on the top right of the drawer to go to the actual Cart page, or click on the "x" button next to the link to hide the drawer.
To avoid errors, the cart drawer is not present on the actual Cart page.

## Cart Page
This page displays all items you have added to your cart. Items with the same core attributes (product name, flavor/size option selected, subscription, delivery span) will be considered as the same item. Therefore, adding items already in the cart will only increase the quantity instead of adding a new row. 
You can still change the quantity and delivery span, or delete items, at this stage. Note that removing items will elicit a pop-up windowing warning you of the consequence of the action. (At the current stage, the removal button is only for display. We will implement the functionality in the future.)
After you are happy with your selection, you can click on the Check Out button. Currently clicking the button has no effect, but it will take you to the Check Out page in future iterations.
