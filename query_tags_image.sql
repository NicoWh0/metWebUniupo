SELECT subq1.*, cnt1.Likes, cnt2.Comments 
FROM (
	SELECT i.Id, i.Title, i.Description, i.UploadDate, i.ImagePath, i.Author AS AuthorId, u.Username AS AuthorName, u.UserImage AS AuthorImage
	FROM Image i JOIN User u ON u.Id = i.Author 
) subq1 JOIN (
	SELECT i.Id FROM Image i JOIN ImageTag it ON i.Id = it.ImageId WHERE it.TagName LIKE ('%' || 'nature' || '%')
) subq2 ON subq2.Id = subq1.Id JOIN (
	SELECT i.Id FROM Image i JOIN User u ON i.Author = u.Id WHERE u.Username LIKE ('%' || 'NicoWho' || '%')
) subq3 ON subq3.Id = subq1.Id JOIN (
	SELECT i.Id FROM Image i JOIN ImageCategory ic ON i.Id = ic.ImageId JOIN Category c ON ic.CategoryId = c.Id WHERE c.Id = 23
) subq4 ON subq4.Id = subq1.Id JOIN (
	SELECT i.Id FROM Image i WHERE i.Title LIKE ('%' || 'nebbia' || '%' )
) subq5 ON subq5.Id = subq1.Id JOIN (
	SELECT i.Id, COUNT(il.ImageId) AS Likes FROM Image i LEFT JOIN ImageLike il ON i.Id = il.ImageId GROUP BY i.Id
) cnt1 ON cnt1.Id = subq1.Id JOIN (
	SELECT i.Id, COUNT(c.ImageId) AS Comments FROM Image i LEFT JOIN Comment c ON i.Id = c.ImageId GROUP BY i.Id
) cnt2 ON cnt2.Id = subq1.Id 
	