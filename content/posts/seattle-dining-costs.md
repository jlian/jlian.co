---
title: "Seattle is the #16 most expensive city in the world for dining, #5 in the US"
date: 2023-05-29T04:08:27Z
tags: [seattle, dining, data, curiosities]
featured_image: "/images/posts/seattle-dining-costs/seattle.jpeg"
description: "Foodie data dive ranking Seattle’s dinner bill against the world."
---

*(Among cities with population of 100,000 or more)*

A few weeks ago I was in Rome, where [$$$$ on TripAdvisor](https://www.tripadvisor.com/Restaurant_Review-g187791-d1380808-Reviews-Ristorante_Crispi_19-Rome_Lazio.html) equates to Ballard prices, I started to wonder *how expensive is Seattle for dining*? *Is it top 10?* I thought it must be but had no data to back it up. Results on Google weren't too helpful. I wanted to understand the cost in absolute terms (not adjusted to local cost of living or purchasing power), like a traveller's perspective.

It turns out that Seattle isn't *top* tier (I thought it might even be even top 5), but #16 (out of 452) is still an impressive showing.

Methodology: I found this [Holidu World Foodie Cities Index](https://www.holidu.co.uk/magazine/the-world-foodie-cities-index), but it has some issues:

- Excludes Seattle (and many other cities) for not being in the list of "The world’s 100 best cities" (wow)
- Uses data from March 2022
- I tried to verify the ranking based on their methodology and came out with different results

So I went to their [cited data source Numbeo](https://www.numbeo.com/cost-of-living/prices_by_city.jsp) and downloaded new data for May 2023. Then I calculated the "foodie score" for all 500 cities included in the dataset with the same math used by Holidu. Lastly, I set a threshold at 100,000 population which seemed like a reasonable cutoff. Here's what I got for top 20 most expensive cities in the world for dining:

| Rank | City           | Country        | Population | Score   |
| ---- | -------------- | -------------- | ---------- | ------- |
| 1    | Zürich         | Switzerland    | 372,857    | £316.01 |
| 2    | Basel          | Switzerland    | 163,216    | £294.16 |
| 3    | Lausanne       | Switzerland    | 144,426    | £292.45 |
| 4    | Geneva         | Switzerland    | 198,899    | £289.29 |
| 5    | Canberra       | Australia      | 351,868    | £283.94 |
| 6    | Adelaide       | Australia      | 1,316,779  | £275.27 |
| 7    | Odense         | Denmark        | 175,245    | £261.99 |
| 8    | Copenhagen     | Denmark        | 601,448    | £257.70 |
| 9    | Reykjavík      | Iceland        | 124,800    | £254.98 |
| 10   | Nassau         | Bahamas        | 274,400    | £252.80 |
| 11   | Bern           | Switzerland    | 141,833    | £250.67 |
| 12   | New York City  | United States  | 8,804,190  | £250.37 |
| 13   | Miami          | United States  | 442,241    | £249.48 |
| 14   | San Francisco  | United States  | 873,965    | £246.93 |
| 15   | Boston         | United States  | 675,647    | £245.71 |
| 16   | Seattle        | United States  | 737,015    | £245.36 |
| 17   | Espoo          | Finland        | 269,802    | £243.35 |
| 18   | Oakland        | United States  | 440,646    | £239.30 |
| 19   | Los Angeles    | United States  | 3,849,297  | £238.84 |
| 20   | Bergen         | Norway         | 278,556    | £237.22 |

Seattle basically only loses to cities in known pricey countries (Switzerland, Iceland, Denmark), as well as as NYC, Miami, SF, and Boston (very close though). The big surprise for me was Adelaide and Canberra in Australia because I feel they didn't have a strong reputation for being top tier expensive.

I shared this with my friends only initially but it seemed like there might be [some interest](https://www.reddit.com/r/Seattle/comments/13ugovo/is_the_cost_of_eating_out_in_seattle_higher_than/) in this data.

Because I lifted the data and methodology from Numbeo and Holidu I don't know exactly how trustworthy they are. But I couldn't find a better approach, so I'd  love to see if others have done this analysis with more rigor.

Full data and ranking here: 

{{< github-button href="https://gist.github.com/jlian/11077b648044d1d7dcd98dcb86def748" label="Gist" >}}

*[Join the discussion on /r/Seattle](https://www.reddit.com/r/Seattle/comments/13ukdt0/seattle_is_the_16_most_expensive_city_in_the/).*
