SELECT DISTINCT i.Title, i.Description, i.UploadDate, i.ImagePath, i.Author AS AuthorId, u.Username AS AuthorName, u.UserImage AS AuthorImage, cnt1.Likes, cnt2.Comments
FROM Image i 
	JOIN User u ON u.Id = i.Author 
	JOIN ImageCategory ic ON i.Id = ic.ImageId
	JOIN Category c ON ic.CategoryId = c.Id
	JOIN ImageTag it ON it.ImageId = i.Id
	JOIN (
		SELECT i.Id, COUNT(il.ImageId) AS Likes FROM Image i LEFT JOIN ImageLike il ON i.Id = il.ImageId
	) cnt1 ON cnt1.Id = i.Id
	JOIN (
		SELECT i.Id, COUNT(c.ImageId) AS Comments FROM Image i LEFT JOIN Comment c ON i.Id = c.ImageId
	) cnt2 ON cnt2.Id = i.Id
WHERE i.Title LIKE ('%' || 'cute' || '%') OR c.Name LIKE ('%' || 'cute' || '%') OR it.TagName LIKE ('%' || 'cute' || '%') OR AuthorName LIKE ('%' || 'Nico' || '%')
LIMIT 100
