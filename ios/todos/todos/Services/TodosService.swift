import Foundation

class TodosService {
    static let shared = TodosService()

    func fetchTodos() async throws -> [TodoSelect] {
        let (data, response) = try await URLSession.shared.data(
            from: URL(string: "/api/todos", relativeTo: Constants.apiURL)!
        )

        print("Raw JSON:")
        print(String(data: data, encoding: .utf8) ?? "N/A")

        guard let http = response as? HTTPURLResponse,
            200..<300 ~= http.statusCode
        else { throw URLError(.badServerResponse) }

        do {
            return try JSONDecoder().decode([TodoSelect].self, from: data)
        } catch {
            if let decodingError = error as? DecodingError {
                print("DECODE ERROR:", decodingError)
            } else {
                print("OTHER ERROR:", error)
            }
            throw error
        }
    }

}
