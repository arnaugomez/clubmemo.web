export const newCountProjectionQuery = {
  $min: [
    {
      $max: [
        {
          $subtract: [
            { $ifNull: ["$config.dailyNewCardsCount", 10] },
            { $size: "$reviewsOfNewCards" },
          ],
        },
        0,
      ],
    },
    { $size: "$newCards" },
  ],
};
