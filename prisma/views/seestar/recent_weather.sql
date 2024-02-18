SELECT
  `seestar`.`weather`.`id` AS `id`,
  `seestar`.`location`.`name` AS `name`,
  `seestar`.`weather`.`type` AS `type`,
  `seestar`.`weather`.`icon` AS `icon`,
  `seestar`.`weather`.`temp` AS `temp`,
  `seestar`.`weather`.`temp_min` AS `temp_min`,
  `seestar`.`weather`.`temp_max` AS `temp_max`,
  `seestar`.`weather`.`visibility` AS `visibility`,
  `seestar`.`weather`.`clouds` AS `clouds`,
  `seestar`.`weather`.`humidity` AS `humidity`,
  `seestar`.`weather`.`rain` AS `rain`,
  `seestar`.`weather`.`calc_at` AS `calc_at`
FROM
  (
    (
      (
        SELECT
          `seestar`.`weather`.`location_id` AS `location_id`,
          max(`seestar`.`weather`.`calc_at`) AS `calc_at`
        FROM
          `seestar`.`weather`
        GROUP BY
          `seestar`.`weather`.`location_id`
      ) `tw`
      LEFT JOIN `seestar`.`weather` ON(
        (
          (`seestar`.`weather`.`calc_at` = `tw`.`calc_at`)
          AND (
            `seestar`.`weather`.`location_id` = `tw`.`location_id`
          )
        )
      )
    )
    LEFT JOIN `seestar`.`location` ON(
      (
        `seestar`.`location`.`id` = `seestar`.`weather`.`location_id`
      )
    )
  )