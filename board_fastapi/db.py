from pymongo import MongoClient

client = MongoClient("mongodb+srv://stradivirus:1q2w3e4r@cluster0.e7rvfpz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Board"]
board_collection = db["board"]
member_collection = db["member"]