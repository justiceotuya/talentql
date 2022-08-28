# Details

## Introduction

The aim of this project is to get paginated data from an api display the data in a table and control the paginated data to display when the user clicks the next or previous button, also show the current page number

## Consideration

- the url is dynamic so changing pages should fetch data based on the page
- returned data always has two data, current data (5) and current data + 1 (5)
- At all times we are to display 5 rows in the table
- make the ui and data fetching process as easy and fast as possible

## Implementation

Data caching technique is used so as to prevent going to the server to get data as much as possible.

Because the keys of the data corresponds to the current page and the current page + 1 data, a store is setup where these data is cached.

Before any trip to the server is done, we check if the page is a key in the cache and use the data to render  the table else we go to the server for the data, store the data in the cache and render the table.

This method reduces the round trip to the server, improves user experience as a loading text is shown when a server trip is made.

also the previous button is disabled when the page number is one

## Concerns

- The data seems to go forever so we do not have the final page and cant implement disabling the next button
- Some Github Action code did not pass because while the test instruction says we should render 5 data for each page, the test is expecting the page to render 10 data as the data-id of the first data for each page which the test is looking for is always n + 10
