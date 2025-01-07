SELECT DISTINCT subq.Id FROM (
	SELECT i.Id, c.name FROM Image i JOIN ImageCategory ic ON i.Id = ic.ImageId JOIN Category c ON ic.CategoryId = c.Id
) subq WHERE subq.name LIKE '%natu%'