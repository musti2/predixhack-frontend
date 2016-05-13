#Predix Hackathon - Canary Front End Application
This is the front-end repository for the Canary predix hackathon project.

### Installing Dependencies
install node modules
```
sudo npm install
```
install bower dependencies
```
bower install
```

Running the app locally.
```
grunt serve
```

### Publish to Cloud Foundry
package the app
```
grunt dist
```
push to cloud foundry
```
cf push
```

#### Elements
###### px-ts-card

⋅⋅⋅ This card houses the px-chart element and some custom attributes for the chart styling, the combo box items and selection when creating a new chart.


⋅⋅⋅ More work is required to get this chart up to the specs that is required to make it a re-usable component while housing the px-chart component.

###### The Navbar
The navbar is pure CSS only.

Using @media queries to hide/show and shorten the navbar.


#### UI Created By:
Mustafa Samar


