import Foundation

enum NetworkError: Error {
    case badResponse
    case badStatus(Int)
    case noAuthToken
}

func makeRequest(
    to path: String,
    queryItems: [URLQueryItem] = []
) throws -> URLRequest {

    guard
        var components = URLComponents(
            url: baseUrl,
            resolvingAgainstBaseURL: false
        )
    else {
        throw NetworkError.badResponse
    }

    components.path =
        baseUrl
        .appendingPathComponent("api")
        .appendingPathComponent(path)
        .path

    if !queryItems.isEmpty {
        components.queryItems = queryItems
    }

    guard let url = components.url else {
        throw NetworkError.badResponse
    }

    var request = URLRequest(url: url)

    guard let token = KeychainHelper.load(forKey: "session_token") else {
        throw NetworkError.noAuthToken
    }

    request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
    return request
}

final class ApiService {
    private let session: URLSession
    private let decoder: JSONDecoder

    init(
        session: URLSession = .shared,
        decoder: JSONDecoder = JSONDecoder()
    ) {
        self.session = session
        self.decoder = decoder
    }

    func request<T: Decodable>(
        _ path: String,
        query: [URLQueryItem] = []
    ) async throws -> T {
        let request = try makeRequest(to: path, queryItems: query)

        let (data, response) = try await session.data(for: request)

        guard let http = response as? HTTPURLResponse else {
            throw NetworkError.badResponse
        }

        guard (200..<300).contains(http.statusCode) else {
            throw NetworkError.badStatus(http.statusCode)
        }

        return try decoder.decode(T.self, from: data)
    }
}
