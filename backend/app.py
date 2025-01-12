from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from services.crawler import WebsiteCrawler
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/api/analyze', methods=['POST'])
def analyze_website():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    try:
        crawler = WebsiteCrawler()
        results = crawler.crawl(url)
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)